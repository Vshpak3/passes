export const preventNegative = (e: any) => {
  if (e.code === "Minus") {
    e.preventDefault()
  }
}
