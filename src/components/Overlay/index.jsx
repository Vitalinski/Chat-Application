import styles from "./Overlay.module.scss"
const Overlay = ({onClick, children}) => {
  return (
    <div className={styles.overlay} onClick={onClick}>
        {children}
    </div> 
  )
}

export default Overlay