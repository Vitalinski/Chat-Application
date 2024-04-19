import { useState } from 'react'
import styles from './ChatList.module.scss'
import AddUser from '../AddUser'

const ChatList = () => {
  const [addMode, setAddMode] = useState(false)
  return (
    <div className={styles.chatList}>
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <img src="/search.png" alt="" />
          <input type="text" placeholder='Search...' />
        </div>
        <img src={addMode?"./minus.png":"./plus.png"} onClick={()=>setAddMode(!addMode)} alt="" className={styles.add} />
      </div>

      <div className={styles.item}>
        <img src="./avatar.png" alt="" />
        <div className={styles.texts}>
          <span>Some Friend</span>
          <p>Hello</p>
        </div>
      </div>

      <div className={styles.item}>
        <img src="./avatar.png" alt="" />
        <div className={styles.texts}>
          <span>Some Friend</span>
          <p>Hello</p>
        </div>
      </div>

      <div className={styles.item}>
        <img src="./avatar.png" alt="" />
        <div className={styles.texts}>
          <span>Some Friend</span>
          <p>Hello</p>
        </div>
      </div>

      <div className={styles.item}>
        <img src="./avatar.png" alt="" />
        <div className={styles.texts}>
          <span>Some Friend</span>
          <p>Hello</p>
        </div>
      </div>

      <div className={styles.item}>
        <img src="./avatar.png" alt="" />
        <div className={styles.texts}>
          <span>Some Friend</span>
          <p>Hello</p>
        </div>
      </div>
      <div className={styles.item}>
        <img src="./avatar.png" alt="" />
        <div className={styles.texts}>
          <span>Some Friend</span>
          <p>Hello</p>
        </div>
      </div>
     {addMode && <AddUser/>} 

    </div>
  )
}

export default ChatList