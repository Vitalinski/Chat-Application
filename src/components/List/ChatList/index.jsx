import { useEffect, useState } from "react";
import styles from "./ChatList.module.scss";
import AddUser from "../AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);

  const { currentUser } = useUserStore();
  const {changeChat} = useChatStore()
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => navigator.updatedAt - a.updatedAt));
      }
    );
    return () => unSub();
  }, [currentUser.id]);
  const handleSelect = async (chat)=>{
changeChat(chat.chatId, chat.user)
  }
  return (
    <div className={styles.chatList}>
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <img src="/search.png" alt="" />
          <input type="text" placeholder="Search..." />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          onClick={() => setAddMode(!addMode)}
          alt=""
          className={styles.add}
        />
      </div>
      {chats.map((chat) => (
        <div className={styles.item} key={chat.chatId} onClick={()=>handleSelect(chat)}>
          <img src={chat.user.avatar||"./avatar.png"} alt="" />
          <div className={styles.texts}>
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
