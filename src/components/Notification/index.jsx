import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
const Notification = () => {
  return (
    <div style={{
      position:'relative'
    }} >
        <ToastContainer style={{
overflow: "hidden",
  }} position="bottom-right" />
    </div>
  )
}

export default Notification