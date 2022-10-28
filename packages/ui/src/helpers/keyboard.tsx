export const preventNegative = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.code === "Minus") {
    e.preventDefault()
  }
}
