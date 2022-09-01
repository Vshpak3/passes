function debounce(fn: (...arg: any) => any, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (...args: any[]) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      timeout = null
      fn(...args)
    }, delay)
  }
}

export default debounce
