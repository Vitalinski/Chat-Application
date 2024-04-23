import { useState } from "react";
import styles from "./Login.module.scss";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase.js";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../lib/unload.js";
const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const {  email, password } = Object.fromEntries(formData);
    try {
     await signInWithEmailAndPassword(auth,email, password)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, description, email, password } = Object.fromEntries(formData);
   
    try {
      if (!username || !email || !password || !description)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }
    
    const qEmail = query(usersRef, where("email", "==", email));
    const querySnapshotEmail = await getDocs(qEmail);
    if (!querySnapshotEmail.empty) {
      return toast.warn("Select another email");
    }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        description,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account created! You can login now!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.login}>
      <div className={styles.item}>
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="text" placeholder="Password" name="password" />
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign In"}{" "}
          </button>
        </form>
      </div>

      <div className={styles.separator}></div>
      <div className={styles.item}>
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload your avatar
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />

          <input type="text" placeholder="Username" name="username" maxLength={18}/>
          <input type="text" placeholder="User description" name="description" maxLength={18} />
          <input type="text" placeholder="Email" name="email" />
          <input type="text" placeholder="Password" name="password" />
          <button disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}{" "}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
