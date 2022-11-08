import ms from 'ms'

import { InvalidScheduledTime } from './error/scheduled.error'

const SCHEDULE_TIME_MIN = ms('10 minutes')
const SCHEDULE_MAX_MONTHS = 6
const SCHEDULE_TIME_MAX = ms(`${SCHEDULE_MAX_MONTHS} months`)

export function checkScheduledAt(scheduledAt: Date) {
  if (scheduledAt.valueOf() < Date.now() + SCHEDULE_TIME_MIN) {
    throw new InvalidScheduledTime(
      'Cannot schedule sooner than 10 minutes in the future',
    )
  }
  if (scheduledAt.valueOf() + SCHEDULE_TIME_MAX > Date.now()) {
    throw new InvalidScheduledTime(
      `Cannot schedule more than ${SCHEDULE_MAX_MONTHS} months in advance`,
    )
  }
}
