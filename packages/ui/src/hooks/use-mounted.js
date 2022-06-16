// Adapted from: https://www.joshwcomeau.com/snippets/react-hooks/use-has-mounted

import { useEffect, useState } from "react"

const useMounted = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

export default useMounted
