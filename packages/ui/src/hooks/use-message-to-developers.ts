import { useEffect } from 'react'

export const useMessageToDevelopers = (messages: string[]) => {
  useEffect(() => {
    console.group('Message to Developers')
    messages.forEach((message) => {
      console.log(message)
    })
    console.groupEnd()
  }, [])
}
