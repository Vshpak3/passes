import { useEffect } from "react"

import { isDev, isStage } from "../helpers/env"

const useMessageToDevelopers = (messages: string[]) => {
  useEffect(() => {
    if (isDev || isStage) {
      return
    }

    console.group("Message to Developers")
    messages.forEach((message) => {
      console.log(message)
    })
    console.groupEnd()
  }, [messages])
}

export default useMessageToDevelopers
