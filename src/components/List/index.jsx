import ChatList from "./ChatList"
import styles from "./List.module.scss"
import UserInfo from "./UserInfo"
const List = () => {
  return (
    <div className={styles.list}>
        <UserInfo/>
        <ChatList/>
    </div>
  )
}

export default List