import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { format } from 'timeago.js';

import { useChatStore } from '../../store/chatStore';
import { auth, db } from '../../store/firebase';
import { useUserStore } from '../../store/userStore';
import Option from '../Option';
import styles from './Detail.module.scss';

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
    useChatStore();
  const { currentUser } = useUserStore();

  const [chat, setChat] = useState();
  useEffect(() => {
    const onSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
    });
    return () => onSub();
  }, [chatId]);

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, 'users', currentUser.id);
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
    resetChat();
  };
  const usefullInfo = `To add a new chat: 
  a) Click "+" in the upper left part of the application (under your description, near the input field).
  b) After that, in the search field that appears, enter !!!EXACT!!! nickname of the desired friend and click "Search".
  c) When the field with the information of the desired user appears, click "Add".
  After completing these steps, the chat with the user is added to your chat list and you can write a message to him.`;
  return (
    <div className={styles.detail}>
      <div className={styles.user}>
        <img src={user?.avatar || './avatar.png'} alt='' />
        <h2>{user?.username}</h2>
        <p>{user?.description}</p>
      </div>
      <div className={styles.info}>
        <Option title={'Useful information / guide'}>
          <div className={styles.text}>
            <div> 1 - To add a new chat: </div>
            <p>
              <b> a)</b> Click &quot;+&ldquo; in the upper left part of the application (under your
              description, near the input field).
            </p>
            <p>
              <b> b)</b> In the search field that appears, enter !!!EXACT!!! nickname of the desired
              friend and click &quot;Search&ldquo;.
            </p>
            <p>
              <b>c)</b> When the field with the information of the desired user appears, click
              &quot;Add&ldquo;.
            </p>
            <p>
              After completing these steps, the chat with the user is added to your chat list and
              you can write a message to him.`
            </p>
            <div> 2 - To change data: </div>
            <p>
              <b> a)</b> Click on the square containing the pencil in the upper left corner of the
              application (after clicking it will be replaced with a check mark).
            </p>
            <p>
              <b> b)</b> Change your nickname, description, and profile photo if you wish. (To
              change your profile photo, click on your profile photo and upload a new photo)
            </p>
            <p>
              <b>c)</b> Click the checkmark to save your changes.
            </p>
            <div>3 - Blocking the user.</div>
            <p>
              To block a user, click the &#34;Block user&rdquo; button in the lower right corner of
              the application.
            </p>
            <p>
              A blocked user does not see your data (nickname, profile photo, description) and
              cannot send you a message or remove the block. You also cannot send him a message,
              however, you can unblock him at any time.
            </p>
          </div>
        </Option>

        <Option title={'Chat information'}>
          <div className={styles.text}>
            <p>Chat added {format(chat?.createdAt?.toDate())}</p>
            <p>Number of messages: {chat?.messages?.length} </p>
          </div>
        </Option>

        <Option title={'Shared photos'}>
          <div className={styles.photos}>
            {chat?.messages?.map(
              (message, i) =>
                message.img && (
                  <div className={styles.photos__item} key={message?.createAt || i}>
                    <div className={styles.photos__item_detail}>
                      <img src={message.img.url} />
                      <span>{message.img.name} </span>
                      <a href={message.img.url} target='blank' download>
                        <img src='./download.png' alt='' className={styles.icon} />
                      </a>{' '}
                    </div>
                  </div>
                ),
            )}
          </div>
        </Option>
      </div>
      <div className={styles.bottom}>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? 'You are blocked'
            : isReceiverBlocked
              ? 'User blocked'
              : 'Block user'}
        </button>
        <button className={styles.logout} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default Detail;
