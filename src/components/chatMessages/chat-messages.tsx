import styles from "./chat-messages.module.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { parseDate } from "../../utils";
import type { TMessages } from "../../types";
import Avatar from "../avatar/avatar";
import { deleteMessage } from "../../slice/thunks/messages";
import { useAppDispatch } from "../../hooks/hooks";

interface ChatMessagesProps {
  messages: TMessages[];
  threadId: string;
  currentUserId: string;
  onUpdateMessage: (messageId: string, message: string) => void;
}

const ChatMessages = ({
  messages,
  threadId,
  currentUserId,
  onUpdateMessage,
}: ChatMessagesProps) => {
  const sortedMessagedByTime = [...messages].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const dispatch = useAppDispatch();

  const returnUserColor = (userId: string) => {
    return "#00" + userId.slice(0, 6);
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
                  <>-Edited{parseDate(message.updatedAt)}</>
                )}
              </div>
              <div className={styles.messageActions}>
                <DeleteForeverIcon
                  className={styles.icons}
                  onClick={() => {
                    window.confirm("Do you want to delete the message?") &&
                      dispatch(
                        deleteMessage({
                          authId: currentUserId,
                          messageId: message.id,
                        })
                      );
                  }}
                />
                <EditIcon
                  className={styles.icons}
                  onClick={() => {
                    onUpdateMessage(message.id, message.text);
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
