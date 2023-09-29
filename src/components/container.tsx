import { FC, useCallback, useEffect } from "react";
import styles from "./container.module.css";
import axios from "axios";
import CONFIG from "./config";
import { DATA_TESTIDS } from "./defines/data-testids";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { authenticate } from "./slice/user.slice";
import { loadAllThreads, loadSingleThread } from "./slice/threads.slice";

interface IContainerProps {
  name: string;
}

const Container: FC<IContainerProps> = ({ name }) => {
  const store = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

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
        title: "Test Thread",
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

  const createMessage = useCallback(async () => {
    const { data } = await axios.post(
      `${CONFIG.BASE_URL}${CONFIG.MESSAGES_NEW}`,
      {
        text: "Ora dovrei addirittura essere un altro user id :D",
        threadId: "7c92eb49-b9fd-4bef-85c5-f6fa82c8f181",
        displayName: "Giovanni Spigoni",
        checkSum: "string",
      },
      {
        headers: {
          Authorization: store.user.id,
        },
      }
    );

    console.log("createMessage", data);
  }, [store]);

  return (
    <div className={styles.container} data-testid={DATA_TESTIDS.ROOT}>
      <h1 className={styles.name}>{name}</h1>

      <h2>Chat</h2>

      <button onClick={() => createThread()}>Create Thread</button>

      <button onClick={() => readAllThreads()}>Read All Threads</button>

      <button onClick={() => createMessage()}>Create Message</button>

      <button
        onClick={() => readThread("7c92eb49-b9fd-4bef-85c5-f6fa82c8f181")}
      >
        Read Thread Not Listed
      </button>

      <div>
        <h2>Threads</h2>
        {store.threads.map((thread) => (
          <div key={thread.id}>
            <span>{thread.title}</span>- <span>{thread.id}</span>
            <button onClick={() => readThread(thread.id)}>Read Thread</button>
            {thread.messages !== undefined && thread.messages.length > 0 && (
              <div>
                <h3>Messages</h3>
                {thread.messages.map((message) => (
                  <div className={styles.messageContainer} key={message.id}>
                    <label>
                      {message.displayName} {message.userId}
                    </label>
                    <span className={styles.messageBody}>{message.text}</span>
                    <span className={styles.messageFooter}>
                      {message.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Container;
