import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import styles from "./Detail.module.scss";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
    useChatStore();
  const { currentUser } = useUserStore();
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
    resetChat()
  };
  return (
    <div className={styles.detail}>
      <div className={styles.user}>
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>{user?.description}</p>
      </div>
      <div className={styles.info}>
        <div className={styles.info__option}>
          <div className={styles.info__option_title}>
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" className={styles.icon} />
          </div>
        </div>

        <div className={styles.info__option}>
          <div className={styles.info__option_title}>
            <span>Privacy and help</span>
            <img src="./arrowUp.png" alt="" className={styles.icon} />
          </div>
        </div>

        <div className={styles.info__option}>
          <div className={styles.info__option_title}>
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" className={styles.icon} />
          </div>
          <div className={styles.photos}>
            <div className={styles.photos__item}>
              <div className={styles.photos__item_detail}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s"
                  alt=""
                />
                <span>photo_name.png </span>
              </div>
              <img src="./download.png" alt="" className={styles.icon} />
            </div>

            <div className={styles.photos__item}>
              <div className={styles.photos__item_detail}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s"
                  alt=""
                />
                <span>photo_name.png </span>
              </div>
              <img src="./download.png" alt="" className={styles.icon} />
            </div>

            <div className={styles.photos__item}>
              <div className={styles.photos__item_detail}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s"
                  alt=""
                />
                <span>photo_name.png </span>
              </div>
              <img src="./download.png" alt="" className={styles.icon} />
            </div>

            <div className={styles.photos__item}>
              <div className={styles.photos__item_detail}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s"
                  alt=""
                />
                <span>photo_name.png </span>
              </div>
              <img src="./download.png" alt="" className={styles.icon} />
            </div>
          </div>
        </div>

        <div className={styles.info__option}>
          <div className={styles.info__option_title}>
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" className={styles.icon} />
          </div>
        </div>

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
