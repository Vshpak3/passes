import { addYears, eachYearOfInterval, getYear } from "date-fns"

export const getExpirationYears = () => {
  const interval = eachYearOfInterval({
    start: new Date(),
    end: addYears(new Date(), 10)
  })

  return interval.map((date) => getYear(date).toString())
}
