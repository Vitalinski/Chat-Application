import {  useState } from "react";
import { useChatStore } from "../../../lib/chatStore";
import { auth, db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";
import styles from "./UserInfo.module.scss";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import upload from "../../../lib/unload.js";

const UserInfo = () => {
  const { currentUser } = useUserStore();
  const { chatId } = useChatStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [username, setUsername] = useState(currentUser.username);
  const [description, setDescription] = useState(currentUser.description);

  const [avatar, setAvatar] = useState({
    file: null,
    url: currentUser.avatar,
  });


  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const editUserData = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
    } else {
      const newUserName = username.trim()
const newDescription = description.trim()
      try {

        if (!newUserName || !newDescription)return toast.warn("Your name and description can`t be empty!");
        



        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", newUserName));
        const querySnapshot = await getDocs(q);
        const existingUser = querySnapshot.docs.find(doc => doc.data().username === newUserName);
        if (existingUser && existingUser.id !== currentUser.id) {
          return toast.warn("Select another username");
        }

        const imgUrl = avatar.file ? await upload(avatar.file) : false;

        await updateDoc(doc(usersRef, currentUser.id), {
          avatar: imgUrl || currentUser.avatar,
          username:newUserName,
          description: newDescription,
        });

        toast.success("Your data was updated!");
        setIsEditMode(false);

      } catch (error) {
        toast.error(error.message);
      } 
    }

  };

  return (
    <div className={styles.userInfo}>
      <div className={styles.user}>
        {!isEditMode ? (
          <>
            <img src={avatar.url|| currentUser.avatar || "./avatar.png"} alt="" />
            <div>
              <h2>{username}</h2>
              <p>{description}</p>
            </div>
          </>
        ) : (
          <>
            <label htmlFor="avatar">
              <img src={avatar.url || "./avatar.png"} alt="" />
            </label>
            <input
              type="file"
              id="avatar"
              style={{ display: "none" }}
              onChange={handleAvatar}
            />
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={18}
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={18}
              />
            </div>
          </>
        )}
      </div>

      {!chatId ? (
        <button onClick={() => auth.signOut()}>Log out</button>
      ) : (
        <div className={styles.icons}>
          {/* <img src="./more.png" alt="" /> */}
          {/* <img src="./video.png" alt="" /> */}
          <img
            src={isEditMode ? "./arrowDown.png" : "./edit.png"}
            alt=""
            onClick={editUserData}
          />
        </div>
      )}
    </div>
  );
};

export default UserInfo;
