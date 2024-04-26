import { useState } from 'react'
import styles from './Option.module.scss'

const Option = ({title, children}) => {
    const [open, setOpen] = useState(false)
  return (
    <div className={styles.option}>
    <div className={styles.option_title}>
      <span>{title}</span>
      <img src={open?"./arrowUp.png":"./arrowDown.png"} alt="" className={styles.icon} onClick={()=>setOpen(!open)} />
    </div>
    {open && children}
  </div>  )
}

export default Option