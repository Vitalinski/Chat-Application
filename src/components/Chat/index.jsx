import { useEffect, useRef, useState } from "react"
import styles from  "./Chat.module.scss"
import EmojiPicker from "emoji-picker-react"
import classNames from "classnames"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
const Chat = () => {
  const {chatId} = useChatStore()
  const [chat, setChat] = useState(null)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const endRef = useRef(null)
useEffect(()=>{
  endRef.current?.scrollIntoView({behavior: 'smooth'})
})
useEffect(()=>{
  const onSub = onSnapshot(doc(db, "chats",chatId),(res)=>{
setChat(res.data())
  })
  return ()=> onSub()
},[chatId])
  const handleEmoji=(e)=>{
    setText(prev=>prev + e.emoji)
  }
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
      <div className={styles.center}>
      <div className={classNames(styles.center__message, styles.center__message_own)}>
<div className={styles.center__message_texts}>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. In, minima! Some message text</p>
<span>1 min ago</span>

</div>

</div>

<div className={styles.center__message}>
<img src="./avatar.png" alt="" />
<div className={styles.center__message_texts}>
<p>Some message text</p>
<span>1 min ago</span>

</div>

</div>

<div className={classNames(styles.center__message, styles.center__message_own)}>
<div className={styles.center__message_texts}>
<img src="./background.avif" alt="" />

<p>Some message text Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, earum? dsfdsfsdfdsfsdfdsfsdf</p>
<span>1 min ago</span>

</div>

</div>

<div className={styles.center__message }>
<img src="./avatar.png" alt="" />
<div className={styles.center__message_texts}>
<p>Some message text</p>
<span>1 min ago</span>

</div>

</div>
<div ref={endRef}></div>
      </div>
      <div className={styles.bottom}>
      <div className={styles.bottom__icons}>
   <img src="./img.png" alt="" />
   <img src="./camera.png" alt="" />
   <img src="./mic.png" alt="" />

      </div>
        <input value={text} type="text" placeholder="Type a message..." onChange={(e)=>setText(e.target.value)} />
        <div className={styles.bottom__emoji}>
          <img src="./emoji.png" alt=""  onClick={()=>setOpen(prev=>!prev)}/>
          <div className={styles.bottom__emoji_picker}>

          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
          </div>
        </div>
<button className={styles.bottom__btn}>Send</button>
      </div>

    </div>
  )
}

export default Chat