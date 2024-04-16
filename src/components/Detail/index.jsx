import styles from  "./Detail.module.scss"

const Detail = () => {
  return (
    <div className={styles.detail}>
        <div className={styles.user}>
    <img src="./avatar.png" alt="" />
    <h2>Sample Friend</h2>
    <p>User description information</p>
    </div>
    <div className={styles.info}>
    <div className={styles.info__option}>
    <div className={styles.info__option_title}>
      <span>Chat Settings</span>
    <img src="./arrowUp.png" alt="" className={styles.icon}/>
    </div>
    </div>

    <div className={styles.info__option}>
    <div className={styles.info__option_title}>
      <span>Privacy and help</span>
    <img src="./arrowUp.png" alt="" className={styles.icon}/>
    </div>
    </div>

    <div className={styles.info__option}>
    <div className={styles.info__option_title}>
      <span>Shared photos</span>
    <img src="./arrowDown.png" alt="" className={styles.icon}/>
    </div>
    <div className={styles.photos}>
    <div className={styles.photos__item}>
    <div className={styles.photos__item_detail}>

      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s" alt="" />
      <span>photo_name.png </span>
    </div>
    <img src="./download.png" alt="" className={styles.icon} />
</div>

<div className={styles.photos__item}>
    <div className={styles.photos__item_detail}>

      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s" alt="" />
      <span>photo_name.png </span>
    </div>
    <img src="./download.png" alt="" className={styles.icon}/>
</div>

<div className={styles.photos__item}>
    <div className={styles.photos__item_detail}>

      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s" alt="" />
      <span>photo_name.png </span>
    </div>
    <img src="./download.png" alt="" className={styles.icon}/>
</div>

<div className={styles.photos__item}>
    <div className={styles.photos__item_detail}>

      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6bbriZBZR6lpx0Zbg1asMMPRT0zkWfgZsnA&s" alt="" />
      <span>photo_name.png </span>
    </div>
    <img src="./download.png" alt="" className={styles.icon}/>
</div>

    </div>
    </div>

    <div className={styles.info__option}>
    <div className={styles.info__option_title}>
      <span>Shared Files</span>
    <img src="./arrowUp.png" alt="" className={styles.icon}/>
    </div>
    </div>

<button>Block User</button>
    </div>
    </div>
  )
}

export default Detail