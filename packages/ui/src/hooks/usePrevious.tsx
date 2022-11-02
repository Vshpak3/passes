import { useEffect, useRef } from "react"

/**
 * A hook that points to the value of this parameter
 *  from the previous render.
 *  https://usehooks.com/usePrevious/
 */
export const usePrevious = <T,>(value: T): T | null => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T | null>(null)
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}
