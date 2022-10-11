// Adapted from: https://www.joshwcomeau.com/snippets/react-hooks/use-has-mounted

import { useEffect, useState } from "react"

export const useMounted = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
