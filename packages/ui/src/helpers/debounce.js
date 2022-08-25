function debounce(fn, delay) {
  let timeout = null
  return function (...args) {
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
