import { addYears, eachYearOfInterval, getYear } from "date-fns"
import { Suffix, Unit } from "react-timeago"

import { plural } from "./plural"

export const getExpirationYears = () => {
  const interval = eachYearOfInterval({
    start: new Date(),
    end: addYears(new Date(), 10)
  })

  return interval.map((date) => getYear(date).toString())
}

export const getShortTimeStamp = (
  value: number,
  unit: Unit,
  suffix: Suffix
) => {
  switch (unit) {
    case "second":
    case "minute":
    case "hour":
    case "day":
      return `${value}${unit.charAt(0)} ${suffix}`
    default:
      return `${plural(unit, value)} ${suffix}`
  }
}
