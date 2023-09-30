import { FC, useCallback, useEffect, useState } from "react";
import styles from "./container.module.css";
import axios from "axios";
import CONFIG from "../config";
import { DATA_TESTIDS } from "./defines/data-testids";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { authenticate } from "../slice/user.slice";
import { loadAllThreads, loadSingleThread } from "../slice/threads.slice";
import Thread from "./thread/thread";
import { setupInterceptorsTo } from "./axios/interceptors";
setupInterceptorsTo(axios);

const Container: FC = () => {
  const store = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  const [state, setState] = useState({
    currentMessage: "",
  });

  const isUserAuthenticated = store.user.id !== "";

  console.log("state", store);

  const authenticateUser = useCallback(async () => {
    const { data } = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.AUTHENTICATION}`,
      {
        email: CONFIG.EMAIL,
      }
    );

    dispatch(authenticate(data));
  }, [dispatch]);

  useEffect(() => {
    if (!isUserAuthenticated) {
      authenticateUser();
    }
  }, [isUserAuthenticated, authenticateUser]);

  const createThread = useCallback(async () => {
    const { data } = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.THREADS_NEW}`,
      {
        title: "Calcetto 2023 - Gruppo Amici",
      },
      {
        headers: {
          Authorization: store.user.id,
        },
      }
    );

    console.log("createThread", data);
  }, [store]);

  const readThread = useCallback(
    async (id: string) => {
      const { data } = await axios.get(
        `${CONFIG.BASE_URL}${CONFIG.THREADS}` + id,
        {
          headers: {
            Authorization: store.user.id,
          },
        }
      );

      dispatch(loadSingleThread(data));
      console.log("readThread", data);
    },
    [store, dispatch]
  );
  const readAllThreads = useCallback(async () => {
    const { data } = await axios.get(`${CONFIG.BASE_URL}${CONFIG.THREADS}`, {
      headers: {
        Authorization: store.user.id,
      },
    });
    console.log("readAllThread", data);

    dispatch(loadAllThreads(data));
  }, [store, dispatch]);

  const createMessage = useCallback(
    async (threadId: string, text: string) => {
      try {
        const { status } = await axios.post(
          `${CONFIG.BASE_URL}${CONFIG.MESSAGES_NEW}`,
          {
            text,
            threadId: threadId,
            displayName: store.user.firstName + " " + store.user.lastName,
            checkSum: "string",
          },
          {
            headers: {
              Authorization: store.user.id,
            },
          }
        );
        if (status !== 200)
          throw new Error("Endpoint not working, please retry"); // this case endpoint is ok but not 200 is returned

        setState({ ...state, currentMessage: "" });
        readThread(threadId);
      } catch (error) {
        alert("Something went wrong with this, please retry");
        console.log(error);
      }
    },
    [store, state, readThread]
  );
  const deleteMessage = useCallback(
    async (messageId: string, threadId: string) => {
      const { data } = await axios.delete(
        `${CONFIG.BASE_URL}${CONFIG.MESSAGES}` + messageId,
        {
          headers: {
            Authorization: store.user.id,
          },
        }
      );
      readThread(threadId); // refreshing current thread
      console.log("deleteMessage", data);
    },
    [store, readThread]
  );

  const updateMessage = useCallback(
    async (messageId: string, threadId: string) => {
      const { data } = await axios.patch(
        `${CONFIG.BASE_URL}${CONFIG.MESSAGES}` + messageId,
        {
          text: "My Edited Message",
        },
        {
          headers: {
            Authorization: store.user.id,
          },
        }
      );
      readThread(threadId); // refreshing current thread
      console.log("updateMessage", data);
    },
    [store, readThread]
  );

  return (
    <div className={styles.container} data-testid={DATA_TESTIDS.ROOT}>
      <h2>Chat</h2>

      <button onClick={() => createThread()}>Create Thread</button>

      <button onClick={() => readAllThreads()}>Read All Threads</button>
      <button
        onClick={() => readThread("7c92eb49-b9fd-4bef-85c5-f6fa82c8f181")}
      >
        Read Thread Not Listed
      </button>

      <div className={styles.threadBar}>
        {store.threads.map((thread) => (
          <Thread
            key={thread.id}
            thread={thread}
            user={store.user}
            createMessage={createMessage}
            updateMessage={updateMessage}
            deleteMessage={deleteMessage}
            readThread={readThread}
          />
        ))}
      </div>
    </div>
  );
};

export default Container;
