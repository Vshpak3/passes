import { RefObject, useEffect } from "react"

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          !ref.current ||
          (event.target instanceof Node && ref.current.contains(event.target))
        ) {
          return
        }
        handler(event)
      }
      document.addEventListener("mouseup", listener)
      document.addEventListener("touchend", listener)
      return () => {
        document.removeEventListener("mouseup", listener)
        document.removeEventListener("touchend", listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  )
}
