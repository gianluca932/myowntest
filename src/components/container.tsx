import { FC, useCallback, useEffect, useState } from "react";
import styles from "./container.module.css";
import axios from "axios";
import CONFIG from "../config";
import { DATA_TESTIDS } from "./defines/data-testids";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { getUser, getUserStatus } from "../slice/user.slice";
import { authenticateUser } from "../slice/thunks/users";
import { loadAllThreads, loadSingleThread } from "../slice/threads.slice";
import Thread from "./thread/thread";
import { setupInterceptorsTo } from "./axios/interceptors";
setupInterceptorsTo(axios);

const Container: FC = () => {
  const store = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const userStatus = useAppSelector(getUserStatus);
  const user = useAppSelector(getUser);
  console.log("user", user, userStatus);
  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(authenticateUser());
    }
  }, [userStatus, dispatch]);

  const [state, setState] = useState({
    currentMessage: "",
  });

  console.log("state", store);

  const createThread = async () => {
    const { data } = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.THREADS_NEW}`,
      {
        title: "Calcetto 2023 - Gruppo Amici",
      },
      {
        headers: {
          Authorization: user.id,
        },
      }
    );

    console.log("createThread", data);
  };

  const readThread = useCallback(
    async (id: string) => {
      const { id: IdUser } = user;
      const { data } = await axios.get(
        `${CONFIG.BASE_URL}${CONFIG.THREADS}` + id,
        {
          headers: {
            Authorization: IdUser,
          },
        }
      );

      dispatch(loadSingleThread(data));
      console.log("readThread", data);
    },
    [user, dispatch]
  );
  const readAllThreads = useCallback(async () => {
    const { id: IdUser } = user;
    const { data } = await axios.get(`${CONFIG.BASE_URL}${CONFIG.THREADS}`, {
      headers: {
        Authorization: IdUser,
      },
    });
    console.log("readAllThread", data);

    dispatch(loadAllThreads(data));
  }, [user, dispatch]);

  const createMessage = useCallback(
    async (threadId: string, text: string) => {
      const { id, firstName, lastName } = user;
      try {
        const { status } = await axios.post(
          `${CONFIG.BASE_URL}${CONFIG.MESSAGES_NEW}`,
          {
            text,
            threadId: threadId,
            displayName: firstName + " " + lastName,
            checkSum: "string",
          },
          {
            headers: {
              Authorization: id,
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
    [user, state, readThread]
  );
  const deleteMessage = useCallback(
    async (messageId: string, threadId: string) => {
      const { id: IdUser } = user;

      const { data } = await axios.delete(
        `${CONFIG.BASE_URL}${CONFIG.MESSAGES}` + messageId,
        {
          headers: {
            Authorization: IdUser,
          },
        }
      );
      readThread(threadId); // refreshing current thread
      console.log("deleteMessage", data);
    },
    [user, readThread]
  );

  const updateMessage = useCallback(
    async (threadId: string, messageId: string, message: string) => {
      console.log(threadId, messageId, message);
      const { id: IdUser } = user;

      let text = prompt("Please enter your name", message);
      if (text == null || text === "") {
        alert("EditedMessage must be filled out");
        return false;
      }

      const { data } = await axios.patch(
        `${CONFIG.BASE_URL}${CONFIG.MESSAGES}` + messageId,
        {
          text,
        },
        {
          headers: {
            Authorization: IdUser,
          },
        }
      );
      readThread(threadId); // refreshing current thread
      console.log("updateMessage", data);
    },
    [user, readThread]
  );

  return (
    <div className={styles.container} data-testid={DATA_TESTIDS.ROOT}>
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
            user={user}
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
