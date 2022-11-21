import { addYears, eachYearOfInterval, getYear } from "date-fns"
import { Suffix, Unit } from "react-timeago"

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
  if (unit === "second") {
    return value + "" + "s" + "" + " " + suffix
  }
  if (unit === "minute") {
    return value + "" + "m" + "" + " " + suffix
  }
  if (unit === "hour") {
    return value + "" + "h" + "" + " " + suffix
  }
  if (unit === "day") {
    return value + "" + "d" + "" + " " + suffix
  }
}
