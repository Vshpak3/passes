import { parse } from "dom-parser-react"
import { createElement, Fragment } from "react"
const formatter = Intl.NumberFormat("en", { notation: "compact" })

export function compactNumberFormatter(num: number) {
  if (num !== 0 && (!num || isNaN(num))) {
    return null
  }
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

export function getNYearsAgoDate(years: number) {
  return new Date(new Date().setFullYear(new Date().getFullYear() - years))
}

export function formatTextToString(text?: string | null) {
  if (!text) {
    return ""
  }
  return text
    .replaceAll("&", "&amp;")
    .replaceAll(" ", "&nbsp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt")
    .replaceAll("€", "&euro;")
    .replaceAll("£", "&pound;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("\n", "<br/>")
}

export function formatText(text?: string | null) {
  return parse(formatTextToString(text), {
    createElement: createElement,
    Fragment: Fragment
  })
}
