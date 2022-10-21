import { SWRConfiguration } from "swr"

export const GlobalSWRConfig: SWRConfiguration = {
  // enable or disable automatic revalidation when component is mounted
  revalidateOnMount: false,

  // automatically revalidate when window gets focused
  revalidateOnFocus: false,

  // only revalidate once during a time span in milliseconds
  focusThrottleInterval: 10000,

  // polling when the window is invisible
  refreshWhenHidden: false,

  // polling when the browser is offline
  refreshWhenOffline: false,

  // automatically revalidate when the browser regains a network connection
  revalidateOnReconnect: false,

  revalidateIfStale: false
}
