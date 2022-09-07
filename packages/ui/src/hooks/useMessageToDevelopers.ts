import { useEffect } from "react"

import { isDev, isStaging } from "../helpers/env"

const useMessageToDevelopers = (messages: string[]) => {
  useEffect(() => {
    if (isDev || isStaging) {
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
