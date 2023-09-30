import styles from "./chat-messages.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { parseDate } from "../../utils";
import type { TMessages } from "../../types";
import Avatar from "../avatar/avatar";
interface ChatMessagesProps {
  messages: TMessages[];
  threadId: string;
  currentUserId: string;
  onDeleteMessage: (id: string, threadId: string) => void;
  onUpdateMessage: (id: string, threadId: string) => void;
}

interface listUserColor {
  [user: string]: string;
}

const ChatMessages = ({
  messages,
  threadId,
  currentUserId,
  onDeleteMessage,
  onUpdateMessage,
}: ChatMessagesProps) => {
  const sortedMessagedByTime = [...messages].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const listUserColors: listUserColor = {};

  const returnUserColor = (userId: string) => {
    // Removed the array type declaration
    if (listUserColors[userId] === undefined) {
      listUserColors[userId] = `#${Math.floor(
        Math.random() * 16777215
      ).toString(16)}`;
    }
    return listUserColors[userId];
  };

  return (
    <div className={styles.messagesContainer}>
      {sortedMessagedByTime.map((message) => (
        <div
          className={
            currentUserId === message.userId
              ? styles.messageContainer
              : styles.messageContainer
          }
          key={message.id}
        >
          <div style={{ width: "20%" }}>
            <Avatar
              fullName={message.displayName}
              color={returnUserColor(message.userId)}
            />
          </div>
          <div className={styles.messageBody}>
            <div
              className={styles.messageText}
              style={{
                backgroundColor: returnUserColor(message.userId),
              }}
            >
              {message.text}
            </div>
            <div className={styles.messageFooter}>
              <div className={styles.messageInfo}>
                {parseDate(message.createdAt)}

                {message.updatedAt !== message.createdAt && (
                  <>- Edited({parseDate(message.updatedAt)}</>
                )}
              </div>
              <div className={styles.messageActions}>
                <DeleteForeverIcon
                  className={styles.icons}
                  onClick={() => {
                    window.confirm("Do you want to delete the message?") &&
                      onDeleteMessage(message.id, threadId);
                  }}
                />
                <EditIcon
                  className={styles.icons}
                  onClick={() => {
                    onUpdateMessage(message.id, threadId);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default ChatMessages;
