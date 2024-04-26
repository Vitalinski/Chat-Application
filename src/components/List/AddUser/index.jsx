import { arrayUnion, collection,  doc,  getDoc,  getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import styles from './AddUser.module.scss'
import { db } from '../../../lib/firebase'
import { useState } from 'react'
import { useUserStore } from '../../../lib/userStore'
import { toast } from 'react-toastify'
import Overlay from '../../Overlay'

const AddUser = ({setAddMode}) => {
  const [user, setUser] =  useState(null)
  const { currentUser } = useUserStore();
  const handleSearch = async(e) =>{
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get("username")
    try{
      const userRef = collection(db, "users")
const q = query(userRef, where("username", "==", username))
const querySnapShot = await getDocs(q)
if(!querySnapShot.empty){
setUser(querySnapShot.docs[0].data())
}
    }
    catch(err){
console.log(err)
    }
  }
  const handleClose = (e)=>{
    e.stopPropagation()
    setAddMode(false)
  }

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {

      const userChatSnapshot = await getDoc(doc(userChatsRef, currentUser.id));
      const userChatData = userChatSnapshot.data();
      if (userChatData) {
        const existingChat = userChatData.chats.find(chat => chat.receiverId === user.id);
        if (existingChat) {
          toast.warning("Chat with this user already exists.");

          return; 
        }
      }


      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
<Overlay onClick={handleClose}>


    <div className={styles.addUser} onClick={(e)=>e.stopPropagation()}>
        <form onSubmit={handleSearch}>
          <button type='button' className={styles.close} onClick={handleClose}>x</button>
            <input type="text" placeholder='Username' name='username' />
            <button>Search</button>
        </form>

        {user && <div className={styles.user}>
        <div className={styles.detail}>
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>

        </div>
<button onClick={handleAdd}>Add User</button>
        </div>}
    </div>
</Overlay>
  )
}

export default AddUser