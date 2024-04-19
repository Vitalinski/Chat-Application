import { useEffect } from "react";
import Chat from "./components/Chat";
import Detail from "./components/Detail";
import List from "./components/List";
import Login from "./components/Login";
import Notification from "./components/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";

const App = () => {
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
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}
      <Notification/>
    </div>
  );
};

export default App;
