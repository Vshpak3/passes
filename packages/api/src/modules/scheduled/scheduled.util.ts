import ms from 'ms'

import { InvalidScheduledTime } from './error/scheduled.error'

const SCHEDULE_TIME_MIN = ms('5 minutes')
const SCHEDULE_MAX_MONTHS = 6
const SCHEDULE_TIME_MAX = ms(`${SCHEDULE_MAX_MONTHS} months`)

export function checkScheduledAt(scheduledAt: Date) {
  if (scheduledAt.valueOf() + SCHEDULE_TIME_MIN < Date.now()) {
    throw new InvalidScheduledTime('Cannot schedule for the past')
  }
  if (scheduledAt.valueOf() + SCHEDULE_TIME_MAX > Date.now()) {
    throw new InvalidScheduledTime(
      `Cannot schedule more than ${SCHEDULE_MAX_MONTHS} months in advance`,
    )
  }
}
