import { FC, useEffect } from "react";
import styles from "./container.module.css";
import axios from "axios";
import { DATA_TESTIDS } from "../defines/data-testids";
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
          <Thread key={thread.id} thread={thread} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Container;
