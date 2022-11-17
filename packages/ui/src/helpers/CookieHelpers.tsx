export type CookiesProps = {
  necessary: boolean
  functional: boolean
  performance: boolean
  targeting: boolean
}
export const acceptAllCookies: CookiesProps = {
  necessary: true,
  functional: true,
  performance: true,
  targeting: true
}

export const rejectAllCookies: CookiesProps = {
  necessary: true,
  functional: false,
  performance: false,
  targeting: false
}
