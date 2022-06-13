import { useCallback, useEffect, useRef } from 'react'

// Utility helper for random number generation
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

export const useRandomInterval = (
  callback: () => void,
  minDelay?: number,
  maxDelay?: number,
) => {
  const timeoutId = useRef<number>()
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const isEnabled =
      typeof minDelay === 'number' && typeof maxDelay === 'number'
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay)
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current()
          handleTick()
        }, nextTickAt)
      }
      handleTick()
    }

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current)
      }
    }
  }, [minDelay, maxDelay])

  // eslint-disable-next-line sonarjs/no-identical-functions
  const cancel = useCallback(() => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current)
    }
  }, [])

  return cancel
}
