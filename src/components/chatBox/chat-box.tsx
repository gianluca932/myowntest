import styles from "./chat-box.module.css";
import { useMemo, useState } from "react";
import { TThreads } from "../../types";
import { useAppDispatch } from "../../hooks/hooks";
import { createMessage } from "../../slice/thunks/messages";
interface ChatBoxProps {
  thread: TThreads;
  currentUserId: string;
  onUpdateMessage: (
    threadId: string,
    messageId: string,
    message: string
  ) => void;
  displayName: string;
}

const ChatBox = ({
  thread,
  currentUserId,
  onUpdateMessage,
  displayName,
}: ChatBoxProps) => {
  const [state, setState] = useState({
    currentMessage: "",
  });

  const lastMessage = useMemo(() => {
    if (thread.messages === undefined) return undefined;

    const messageByUserId = thread.messages.filter(
      (thread) => thread.userId === currentUserId
    );
    const lastMessageByUserId =
      messageByUserId !== undefined &&
      messageByUserId[messageByUserId.length - 1];

    return lastMessageByUserId;
  }, [thread, currentUserId]);

  const dispatch = useAppDispatch();

  const handleKeyUp = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowUp") {
      if (lastMessage === undefined || lastMessage === false) {
        alert("No message to edit");
        return false;
      }
      onUpdateMessage(thread.id, lastMessage.id, lastMessage.text);
    }
  };

  return (
    <div className={styles.chatBoxContainer} onKeyUp={handleKeyUp}>
      <div className={styles.chatBoxInputContainer}>
        <label style={{ padding: "2px" }}>{displayName}</label>
        <br />
        <textarea
          className={styles.chatBoxInput}
          placeholder="Write your message here"
          value={state.currentMessage}
          onChange={(e) => {
            setState({ ...state, currentMessage: e.target.value });
          }}
        />
      </div>
      <div className={styles.chatBoxButtonContainer}>
        <button
          className={styles.chatBoxButton}
          onClick={() => {
            dispatch(
              createMessage({
                authId: currentUserId,
                threadId: thread.id,
                text: state.currentMessage,
                displayName,
              })
            );
            setState({ ...state, currentMessage: "" });
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};
export default ChatBox;
