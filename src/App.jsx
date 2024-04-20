import { useEffect } from "react";
import Chat from "./components/Chat";
import Detail from "./components/Detail";
import List from "./components/List";
import Login from "./components/Login";
import Notification from "./components/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const {chatId} = useChatStore()
  const {currentUser, isLoading, fetchUserInfo} = useUserStore()
  useEffect(()=>{
    const onSub = onAuthStateChanged(auth, (user)=>{
fetchUserInfo(user?.uid)    })
    return ()=> onSub()
  },[fetchUserInfo])
  if(isLoading){
    return <div className="loading">Loading...</div>
  }
  else  return (
    
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
         {chatId &&  <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification/>
    </div>
  );
};

export default App;
