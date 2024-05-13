import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { useChatStore } from '../../../store/chatStore';
import { db } from '../../../store/firebase';
import { useUserStore } from '../../../store/userStore';
import AddUser from '../AddUser';
import styles from './ChatList.module.scss';

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('');

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();
  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => navigator.updatedAt - a.updatedAt));
    });
    return () => unSub();
  }, [currentUser.id]);
  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
    userChats[chatIndex].isSeen = true;
    const userChatRef = doc(db, 'userchats', currentUser.id);

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase()),
  );
  return (
    <div className={styles.chatList}>
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <img src='/search.png' alt='' />
          <input type='text' placeholder='Search...' onChange={(e) => setInput(e.target.value)} />
        </div>
        <img
          src={addMode ? './minus.png' : './plus.png'}
          onClick={() => setAddMode(!addMode)}
          alt=''
          className={styles.add}
        />
      </div>
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <div
            className={styles.item}
            style={{
              backgroundColor: chat.isSeen ? 'transparent' : ' #f1eeeed2',
            }}
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
          >
            <img
              src={
                chat.user.blocked.includes(currentUser.id)
                  ? './avatar.png'
                  : chat.user.avatar || './avatar.png'
              }
              alt=''
            />
            <div className={styles.texts}>
              <span>
                {chat.user.blocked.includes(currentUser.id) ? 'User' : chat.user.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.nochats}>No chats</div>
      )}

      {addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
};

export default ChatList;
