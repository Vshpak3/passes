import { parse } from "dom-parser-react"
import { createElement, Fragment } from "react"

import { FormatCurrencyOption } from "src/components/types/UtilTypes"

const formatter = Intl.NumberFormat("en", { notation: "compact" })

export function compactNumberFormatter(num: number) {
  if (num !== 0 && (!num || isNaN(num))) {
    return null
  }
  return formatter.format(num)
}

export function formatCurrency(
  value: number,
  options: FormatCurrencyOption = {}
) {
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

const HTML_CHARACTERS_ORDER = ["&", " ", "<", ">", "€", "£", '"', "'", "\n"]

const HTML_CHARACTERS: Record<string, string> = {
  "&": "&amp;",
  " ": "&nbsp;",
  "<": "&lt;",
  ">": "&gt",
  "€": "&euro;",
  "£": "&pound;",
  '"': "&quot;",
  "'": "&apos;",
  "\n": "<br/>"
}

export function formatTextToString(text?: string | null) {
  if (!text) {
    return ""
  }
  HTML_CHARACTERS_ORDER.forEach((char) => {
    text.replaceAll(char, HTML_CHARACTERS[char])
  })
  return text
}

export function formatReplacedText(
  text: string,
  replacements: Record<number, string>
) {
  let ret = ""
  for (let i = 0; i < text.length; ++i) {
    ret = ret.concat(replacements[i] ?? HTML_CHARACTERS[text[i]] ?? text[i])
  }
  return formatTextFromString(ret)
}

function formatTextFromString(text: string) {
  return parse(text, {
    createElement: createElement,
    Fragment: Fragment
  })
}

export function formatText(text?: string | null) {
  return formatTextFromString(formatTextToString(text))
}
