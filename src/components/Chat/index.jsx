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
      <div className={styles.bottom}>
      <div className={styles.bottom__icons}>
   <img src="./img.png" alt="" />
   <img src="./camera.png" alt="" />
   <img src="./mic.png" alt="" />

      </div>
        <input type="text" placeholder="Type a message..." />
        <div className={styles.bottom__emoji}>
          <img src="./emoji.png" alt="" />
        </div>
<button className={styles.bottom__btn}>Send</button>
      </div>

    </div>
  )
}

export default Chat