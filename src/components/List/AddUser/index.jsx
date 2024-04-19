import styles from './AddUser.module.scss'

const AddUser = () => {
  return (
    <div className={styles.addUser}>
        <form >
            <input type="text" placeholder='Username' name='username' />
            <button>Search</button>
        </form>

        <div className={styles.user}>
        <div className={styles.detail}>
            <img src="./avatar.png" alt="" />
            <span>Sample User</span>

        </div>
<button>Add User</button>
        </div>
    </div>
  )
}

export default AddUser