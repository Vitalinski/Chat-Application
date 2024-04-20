import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.scss";
import EmojiPicker from "emoji-picker-react";
import classNames from "classnames";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
const Chat = () => {
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });
  useEffect(() => {
    const onSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => onSub();
  }, [chatId]);
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };
  const handleSend = async () => {
    if (text === "") return;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatRef);
        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();
          const chatIndex = userChatData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatData.chats[chatIndex].lastMessage = text;
          userChatData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.chat}>
      <div className={styles.top}>
        <div className={styles.top__user}>
          <img src={user.avatar || "./avatar.png"} alt="" />
          <div className={styles.top__texts}>
            <span>{user.username}</span>
            <p>Sample user description</p>
          </div>
        </div>
        <div className={styles.top__icons}>
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className={styles.center}>
        {chat?.messages?.map((message, i) => (
          <div
            className={classNames(
              styles.center__message,
              styles.center__message_own
            )}
            key={message?.createAt || i}
          >
            <div className={styles.center__message_texts}>
              {message.img && <img src={message.img} />}
              <p>{message.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottom__icons}>
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          value={text}
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.bottom__emoji}>
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className={styles.bottom__emoji_picker}>
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className={styles.bottom__btn} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
