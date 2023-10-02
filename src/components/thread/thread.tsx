import styles from "./thread.module.css";
import { useState } from "react";
import ChatBox from "../chatBox/chat-box";
import ChatMessages from "../chatMessages/chat-messages";
import { TThreads, TUser } from "../../types";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

interface IThreadProps {
  thread: TThreads;
  user: TUser;
  readThread: (id: string) => void;
  createMessage: (threadId: string, text: string) => void;
  deleteMessage: (threadId: string, messageId: string) => void;
  updateMessage: (threadId: string, messageId: string, message: string) => void;
}

const Thread = ({
  thread,
  user,
  readThread,
  createMessage,
  deleteMessage,
  updateMessage,
}: IThreadProps) => {
  const [state, setState] = useState({
    isClosed: true,
  });

  const toggleThread = () => {
    if (state.isClosed) readThread(thread.id);
    setState({ ...state, isClosed: !state.isClosed });
  };

  console.log(user, "user");
  return (
    <div key={thread.id} className={styles.chatContainer}>
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
              onDeleteMessage={deleteMessage}
              onUpdateMessage={updateMessage}
            />
          ) : (
            <div>No messages</div>
          )}
          <ChatBox
            thread={thread}
            currentUserId={user.id}
            onCreateMessage={createMessage}
            onUpdateMessage={updateMessage}
            displayName={user.firstName + " " + user.lastName}
          />
        </div>
      )}
    </div>
  );
};
export default Thread;
