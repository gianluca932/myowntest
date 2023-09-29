import { FC, useCallback, useEffect, useState } from "react";
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

  const createMessage = useCallback(
    async (threadId: string) => {
      const { data } = await axios.post(
        `${CONFIG.BASE_URL}${CONFIG.MESSAGES_NEW}`,
        {
          text: state.currentMessage,
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

      setState({ ...state, currentMessage: "" });
      readThread(threadId);
      console.log("createMessage", data);
    },
    [store, state, readThread]
  );

  return (
    <div className={styles.container} data-testid={DATA_TESTIDS.ROOT}>
      <h1 className={styles.name}>{name}</h1>

      <h2>Chat</h2>

      <button onClick={() => createThread()}>Create Thread</button>

      <button onClick={() => readAllThreads()}>Read All Threads</button>
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
            {thread.messages !== undefined && thread.messages.length > 0 ? (
              <div>
                <h3>Messages</h3>
                {thread.messages.map((message, i, thread) => (
                  <div
                    className={
                      store.user.id === message.userId
                        ? styles.currentlyUserBox
                        : styles.messageContainer
                    }
                    key={message.id}
                  >
                    {(i === 0 || message.userId !== thread[i - 1].userId) && (
                      <label>
                        {message.displayName}{" "}
                        <p style={{ fontSize: "9px" }}>{message.userId}</p>
                      </label>
                    )}
                    <span className={styles.messageBody}>{message.text}</span>
                    <span className={styles.messageFooter}>
                      {message.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div>No messages</div>
            )}
            <div className={styles.iputMessageContainer}>
              <label>
                {store.user.firstName} {store.user.lastName}
              </label>
              <input
                className={styles.messageInputBox}
                type="text"
                placeholder="Write your message here"
                value={state.currentMessage}
                onChange={(e) => {
                  setState({ ...state, currentMessage: e.target.value });
                }}
              />
              <button onClick={() => createMessage(thread.id)}>
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Container;
