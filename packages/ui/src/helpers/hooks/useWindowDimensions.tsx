import { useEffect, useState } from "react"

type WindowDimensions = {
  width: number | undefined
  height: number | undefined
  isMobileScreen: boolean | undefined
  isTabletScreen: boolean | undefined
}

const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: undefined,
    height: undefined,
    isMobileScreen: undefined,
    isTabletScreen: undefined
  })

  useEffect(() => {
    function handleResize(): void {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobileScreen: window.innerWidth < 768,
        isTabletScreen: window.innerWidth > 768 && window.innerWidth <= 1024
      })
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return (): void => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return windowDimensions
}

export default useWindowDimensions
