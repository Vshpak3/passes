import { useEffect, useState } from "react"

import { breakpoints } from "src/styles/breakpoints"

// Define general type for useWindowSize hook, which includes width and height

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  function handleResize() {
    const windowWidth = window.innerWidth ?? breakpoints.md
    setIsMobile(windowWidth < breakpoints.md)
    setIsTablet(windowWidth < breakpoints.lg)
    // Set window width/height to state
  }

  const [isMobile, setIsMobile] = useState<boolean>()
  const [isTablet, setIsTablet] = useState<boolean>()

  useEffect(() => {
    // Handler to call on window resize
    if (typeof window !== "undefined") {
      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Add event listener
      window.addEventListener("resize", handleResize)

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount

  return {
    isMobile,
    isTablet
  }
}
