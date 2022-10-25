// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import { useEffect } from "react"

import { isDev, isStage } from "src/helpers/env"

export const useMessageToDevelopers = (messages: string[]) => {
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
