import styles from "./chat-box.module.css";
import { useState } from "react";
interface ChatBoxProps {
  threadId: string;
  currentUserId: string;
  onCreateMessage: (threadId: string, text: string) => void;
  displayName: string;
}

const ChatBox = ({
  threadId,
  currentUserId,
  onCreateMessage,
  displayName,
}: ChatBoxProps) => {
  const [state, setState] = useState({
    currentMessage: "",
  });

  return (
    <div className={styles.chatBoxContainer}>
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
            onCreateMessage(threadId, state.currentMessage);
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
