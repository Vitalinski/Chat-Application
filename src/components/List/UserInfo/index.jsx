import { useChatStore } from '../../../lib/chatStore'
import { auth } from '../../../lib/firebase'
import { useUserStore } from '../../../lib/userStore'
import styles from './UserInfo.module.scss'

const UserInfo = () => {
  const {currentUser} = useUserStore()
  const {chatId} = useChatStore()

  return (
    <div className={styles.userInfo}>
        <div className={styles.user}>
        <img src={currentUser.avatar||"./avatar.png"} alt="" />
        <div>

        <h2>{currentUser.username}</h2>
        <p>{currentUser.description}</p>

</div>
        </div>

        {!chatId?<button onClick={()=> auth.signOut()}>Log out</button>: <div className={styles.icons}>
          <img src="./more.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./edit.png" alt="" />

        </div>

        }
       

    </div>
  )
}

export default UserInfo