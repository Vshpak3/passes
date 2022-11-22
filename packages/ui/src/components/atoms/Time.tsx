import { isAfter, subDays } from "date-fns"
import TimeAgo from "react-timeago"

import { getShortTimeStamp } from "src/helpers/dates"

interface TimeProps {
  date?: Date | null
  className: string
  minPeriod?: number
  buffer?: number
  live?: boolean
}
export const Time = ({
  date,
  className,
  minPeriod = 30,
  buffer = 25,
  live = true
}: TimeProps) => {
  return date && isAfter(date, subDays(new Date(), buffer)) ? (
    <TimeAgo
      className={className}
      date={date ?? ""}
      formatter={getShortTimeStamp}
      live={live}
      minPeriod={minPeriod}
    />
  ) : (
    <span className={className}>{date?.toLocaleDateString()}</span>
  )
}
