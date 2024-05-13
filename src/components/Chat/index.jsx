import classNames from 'classnames';
import EmojiPicker from 'emoji-picker-react';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { format } from 'timeago.js';

import { useChatStore } from '../../store/chatStore';
import { db } from '../../store/firebase';
import upload from '../../store/unload';
import { useUserStore } from '../../store/userStore';
import styles from './Chat.module.scss';

const Chat = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState({
    file: null,
    url: '',
  });
  const emojiPickerRef = useRef(null);
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);
  useEffect(() => {
    const onSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
    });
    return () => onSub();
  }, [chatId]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };
  const handleSend = async () => {
    if (text === '') return;
    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && {
            img: {
              url: imgUrl,
              name: img.file.name,
            },
          }),
        }),
      });
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, 'userchats', id);
        const userChatSnapshot = await getDoc(userChatRef);
        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();
          const chatIndex = userChatData.chats.findIndex((c) => c.chatId === chatId);
          userChatData.chats[chatIndex].lastMessage = text;
          userChatData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatRef, {
            chats: userChatData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: '',
    });
    setText('');
  };
  return (
    <div className={styles.chat}>
      <div className={styles.top}>
        <div className={styles.top__user}>
          <img src={user?.avatar || './avatar.png'} alt='' />
          <div className={styles.top__texts}>
            <span>{user?.username}</span>
            <p>{user?.description}</p>
          </div>
        </div>
        <div className={styles.top__icons}>
          <img src='./phone.png' alt='' />
          <img src='./video.png' alt='' />
          <img src='./info.png' alt='' />
        </div>
      </div>
      <div className={styles.center}>
        {chat?.messages?.length > 0 ? (
          chat?.messages?.map((message, i) => (
            <div
              className={classNames(styles.center__message, {
                [styles.center__message_own]: message.senderId === currentUser.id,
              })}
              key={message?.createAt || i}
            >
              <div className={styles.center__message_texts}>
                {message.img && <img src={message.img.url} />}
                <p>{message.text}</p>
                <span>{format(message.createdAt.toDate())}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noMessages}>
            <p>No messages</p>{' '}
            <p>
              Send<span> &quot;Hi 👋&ldquo; </span>to start the conversation.
            </p>
          </div>
        )}
        {img.url && (
          <div className={classNames(styles.center__message, styles.center__message_own)}>
            <div className={styles.center__message_texts}>
              <img src={img.url} />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottom__icons}>
          <label
            className={classNames({
              [styles.disabled]: isCurrentUserBlocked || isReceiverBlocked,
            })}
            htmlFor='file'
          >
            <img src='./img.png' alt='' />
          </label>
          <input type='file' id='file' style={{ display: 'none' }} onChange={handleImg} />
        </div>
        <input
          value={text}
          type='text'
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? 'You can not send a message'
              : 'Type a message...'
          }
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />

        <div className={styles.bottom__emoji} ref={emojiPickerRef}>
          <img
            className={classNames({
              [styles.disabled]: isCurrentUserBlocked || isReceiverBlocked,
            })}
            src='./emoji.png'
            alt=''
            onClick={() => setOpen((prev) => !prev)}
          />

          <div className={styles.bottom__emoji_picker}>
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          className={styles.bottom__btn}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
