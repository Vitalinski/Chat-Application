import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import styles from "./Detail.module.scss";
import Option from "../Option";
import { useEffect, useState } from "react";

const Detail = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();
  const { currentUser } = useUserStore();


const [chat, setChat] = useState()
  useEffect(() => {
    const onSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => onSub();
  }, [chatId]);


  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };
  return (
    <div className={styles.detail}>
      <div className={styles.user}>
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>{user?.description}</p>
      </div>
      <div className={styles.info}>
        <Option title={"Chat settings"}></Option>

        <Option title={"Privacy and help"}></Option>

        <Option title={"Shared photos"}>
        <div className={styles.photos}>

        {chat?.messages?.map((message, i) => (
          message.img &&  <div
          className={styles.photos__item}
            key={message?.createAt || i}
          >
            <div className={styles.photos__item_detail}>
             <img src={message.img.url} />
              <span>{message.img.name} </span>
              <a href={message.img.url} target="blank" download>
              <img src="./download.png" alt="" className={styles.icon} />
            </a>                     </div>

          </div>
        ))}
          
           
          </div>
        </Option>

        <Option title={"Shared files"}></Option>

        
      </div>
      <div className={styles.bottom}>
      <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are blocked"
            : isReceiverBlocked
            ? "User blocked"
            : "Block user"}
        </button>
        <button className={styles.logout} onClick={handleLogout}>
          Log out
        </button>
        </div>
    </div>
  );
};

export default Detail;
