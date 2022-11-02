import { MutableRefObject, useEffect, useRef, useState } from "react"

/**
 * Hook that can tell you whether an HTML element
 *  is in the viewport or not. Gives you back a [ref, isOnScreen] tuple.
 *
 * https://stackoverflow.com/questions/58341787/intersectionobserver-with-react-hooks/67826055#67826055
 */
export const useOnScreen = (
  options: IntersectionObserverInit
): [MutableRefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    const currentRef = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      setIsOnScreen(entry.isIntersecting)
    }, options)

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref, options])

  return [ref, isOnScreen]
}
