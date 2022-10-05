import { MutableRefObject, useEffect, useRef, useState } from "react"

export const useOnScreen = (
  options: IntersectionObserverInit
): [MutableRefObject<HTMLElement | null>, boolean] => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const currentRef = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
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

  return [ref, visible]
}
