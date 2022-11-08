import * as Sentry from '@sentry/node'
import ms from 'ms'

const SENTRY_CLOSE_TIMEOUT = ms('2 seconds')

export const closeSentry = (): Promise<boolean> => {
  return Sentry.close(SENTRY_CLOSE_TIMEOUT)
}
