import { useEffect } from "react"

export const useDebouncedEffect = (
  effect: () => void,
  deps: any,
  delay?: any
) => {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handler = setTimeout(() => effect(), (delay = 2000))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay])
}
