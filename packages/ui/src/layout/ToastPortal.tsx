import ms from "ms"
import ReactDOM from "react-dom"
import { ToastContainer } from "react-toastify"

const ToastPortal = () => {
  if (typeof window === "undefined") {
    return null
  }

  const toastRoot = document.getElementById("toast-root")
  return ReactDOM.createPortal(
    <ToastContainer
      autoClose={ms("4 seconds")}
      className="z-[20000]"
      closeOnClick
      draggable={false}
      hideProgressBar
      limit={3}
      newestOnTop={false}
      pauseOnFocusLoss
      pauseOnHover
      position="bottom-center"
      rtl={false}
      theme="colored"
    />,
    toastRoot as HTMLElement
  )
}

// eslint-disable-next-line import/no-default-export
export default ToastPortal
