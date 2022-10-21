import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { useEventListener } from "src/hooks/useEventListener"

import { useEventCallback } from "./useEventCallback"

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent
  }
}

type SetValue<T> = Dispatch<SetStateAction<T | undefined>>

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (parseJSON(item) as T) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error)
      return initialValue
    }
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue: SetValue<T> = useEventCallback((value: any) => {
    if (typeof window === "undefined") {
      console.error(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      )
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value

      if (newValue === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(newValue))
        setStoredValue(newValue)
      }

      window.dispatchEvent(new Event("local-storage"))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  })

  useEffect(() => {
    setStoredValue(readValue())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return
      }
      setStoredValue(readValue())
    },
    [key, readValue]
  )

  useEventListener("storage", handleStorageChange)
  useEventListener("local-storage", handleStorageChange)

  return [storedValue, setValue]
}

function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "")
  } catch {
    console.error("parsing error on", { value })
    return undefined
  }
}
