import { useEffect, useState } from "react"

import { breakpoints } from "src/styles/breakpoints"

// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width: number | undefined
  height: number | undefined
}

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  })
  const windowWidth =
    windowSize && windowSize.width ? windowSize.width : breakpoints.md
  const isMobile = windowWidth < breakpoints.md
  const isTablet = windowWidth < breakpoints.lg

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window ? window.innerWidth : 0,
        height: window ? window.innerHeight : 0
      })
    }
    if (typeof window !== "undefined") {
      // Add event listener
      window.addEventListener("resize", handleResize)
      // Call handler right away so state gets updated with initial window size
      handleResize()
    }

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return {
    isMobile,
    isTablet
  }
}
