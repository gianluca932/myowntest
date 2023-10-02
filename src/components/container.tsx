import { FC, useCallback, useEffect } from "react";
import styles from "./container.module.css";
import axios from "axios";
import CONFIG from "../slice/config";
import { DATA_TESTIDS } from "./defines/data-testids";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { getUser, getUserStatus } from "../slice/user.slice";
import { authenticateUser } from "../slice/thunks/users";
import Thread from "./threadBox/thread-box";
import { setupInterceptorsTo } from "./axios/interceptors";
import {
  readAllThread,
  readThread,
  createThread,
} from "../slice/thunks/threads";
setupInterceptorsTo(axios);

const Container: FC = () => {
  const store = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const userStatus = useAppSelector(getUserStatus);
  const user = useAppSelector(getUser);

  useEffect(() => {
    if (userStatus === "idle") {
      dispatch(authenticateUser());
    }
  }, [userStatus, dispatch]);

  console.log("state", store);

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

      console.log("deleteMessage", data);
    },
    [user]
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

      console.log("updateMessage", data);
    },
    [user]
  );

  return (
    <div className={styles.container} data-testid={DATA_TESTIDS.ROOT}>
      <button
        onClick={() =>
          dispatch(
            createThread({ authId: user.id, title: "Test Thread to Create" })
          )
        }
      >
        Create Thread
      </button>

      <button onClick={() => dispatch(readAllThread({ authId: user.id }))}>
        Read All Threads
      </button>
      <button
        onClick={() =>
          dispatch(
            readThread({
              authId: user.id,
              id: "7c92eb49-b9fd-4bef-85c5-f6fa82c8f181",
            })
          )
        }
      >
        Read Thread Not Listed
      </button>

      <div className={styles.threadBar}>
        {store.threads.map((thread) => (
          <Thread
            key={thread.id}
            thread={thread}
            user={user}
            updateMessage={updateMessage}
            deleteMessage={deleteMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default Container;
