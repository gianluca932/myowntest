import styles from "./thread-box.module.css";
import { useState, useCallback, useEffect, useMemo } from "react";
import ChatBox from "../chatBox/chat-box";
import ChatMessages from "../chatMessages/chat-messages";
import { TThreads, TUser } from "../../types";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { readThread } from "../../slice/thunks/threads";
import { useAppDispatch } from "../../hooks/hooks";
import useWebSocket, { ReadyState } from "react-use-websocket";
import mp3Notification from "../../assets/notification.mp3";
import { updateMessage } from "../../slice/thunks/messages";
interface IThreadProps {
  thread: TThreads;
  user: TUser;
}

const Thread = ({ thread, user }: IThreadProps) => {
  const [state, setState] = useState({
    isClosed: true,
  });

  const dispatch = useAppDispatch();
  const URL_WEB_SOCKET =
    "ws://confi-codin-1xbkniq7crrwz-645813469.us-west-2.elb.amazonaws.com/ws";

  const { sendJsonMessage, readyState, lastMessage } = useWebSocket(
    URL_WEB_SOCKET,
    {
      shouldReconnect: (closeEvent) => true,
      reconnectAttempts: 10,
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const lastMessageIdByThread = useMemo(() => {
    if (thread.messages !== undefined && thread.messages.length > 0) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      return lastMessage.id;
    }
    return "";
  }, [thread]);

  const handleWSAuthentication = useCallback(() => {
    sendJsonMessage({
      type: "THREAD_SUBSCRIPTION",
      payload: {
        authorization: user.id,
        threadId: thread.id,
      },
    });
  }, [sendJsonMessage, thread, user.id]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const { type, payload } = JSON.parse(lastMessage.data);

      if (type === "MESSAGE_CREATED") {
        if (lastMessageIdByThread !== payload.message.id) {
          /* Last message is not the same as the one received from WS */
          const audioNotification = new Audio(mp3Notification);
          audioNotification.play();
          dispatch(
            readThread({
              authId: user.id,
              id: payload.threadId, // Assuming payload contains threadId
            })
          );
        }
      }
    }
  }, [dispatch, lastMessage, lastMessageIdByThread, user.id]);

  const toggleThread = () => {
    if (state.isClosed) {
      dispatch(readThread({ id: thread.id, authId: user.id }));
      handleWSAuthentication();
    }
    setState({ ...state, isClosed: !state.isClosed });
  };

  const onUpdateMessage = useCallback(
    (messageId: string, text: string) => {
      let message = prompt("Please enter your name", text);
      if (message == null || message === "") {
        alert("EditedMessage must be filled out");
        return false;
      }
      dispatch(
        updateMessage({
          authId: user.id,
          messageId,
          message,
        })
      );
    },
    [dispatch, user.id]
  );

  return (
    <div key={thread.id} className={styles.chatContainer}>
      <div>
        <span>The WebSocket is currently {connectionStatus}</span>
        <br />
        {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      </div>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderTitle}>
          <span>{thread.title}</span>
          <br />
          <span style={{ fontSize: "8px" }}>{thread.id}</span>
          <br />
        </div>
        <div className={styles.chatHeaderActions}>
          {state.isClosed ? (
            <OpenInFullIcon onClick={toggleThread} />
          ) : (
            <CloseIcon onClick={toggleThread} />
          )}
        </div>
      </div>
      {state.isClosed ? null : (
        <div className={styles.threadContainer}>
          {thread.messages !== undefined && thread.messages.length > 0 ? (
            <ChatMessages
              messages={thread.messages}
              threadId={thread.id}
              currentUserId={user.id}
              onUpdateMessage={onUpdateMessage}
            />
          ) : (
            <div>No messages</div>
          )}
          <ChatBox
            thread={thread}
            currentUserId={user.id}
            onUpdateMessage={onUpdateMessage}
            displayName={user.firstName + " " + user.lastName}
          />
        </div>
      )}
    </div>
  );
};
export default Thread;
