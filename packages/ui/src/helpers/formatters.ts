const formatter = Intl.NumberFormat("en", { notation: "compact" })

export function compactNumberFormatter(num: number) {
  if (!num || isNaN(num)) return null
  return formatter.format(num)
}

export function formatCurrency(value: number, options: any = {}) {
  const defaultOptions = {
    currency: "USD",
    locale: "en-US"
  }
  const formatter = new Intl.NumberFormat(
    options.locale || defaultOptions.locale,
    { style: "currency", currency: options.currency || defaultOptions.currency }
  )
  return formatter.format(value)
}

export function getFormattedDate(date: Date) {
  return `${date.getDate().toLocaleString()}  ${date
    .toLocaleDateString("en-us", {
      month: "short"
    })
    .toLocaleString()},  ${date.getFullYear()}`
}
