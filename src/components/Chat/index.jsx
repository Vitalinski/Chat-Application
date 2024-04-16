import styles from  "./Chat.module.scss"

const Chat = () => {
  return (
    <div className={styles.chat}>
      <div className={styles.top}>
      <div className={styles.top__user}>
<img src="./avatar.png" alt="" />
<div className={styles.top__texts}>
<span>Sample Friend</span>
<p>Sample user description</p>
</div>

      </div>
   <div className={styles.top__icons}>
   <img src="./phone.png" alt="" />
   <img src="./video.png" alt="" />
   <img src="./info.png" alt="" />

      </div>
      </div>
      <div className={styles.center}></div>
      <div className={styles.bottom}></div>

    </div>
  )
}

export default Chat