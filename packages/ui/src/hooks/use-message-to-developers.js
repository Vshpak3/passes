import { useEffect } from "react"

const useMessageToDevelopers = (messages) => {
  useEffect(() => {
    console.group("Message to Developers")
    messages.forEach((message) => {
      console.log(message)
    })
    console.groupEnd()
  }, [])
}

export default useMessageToDevelopers
