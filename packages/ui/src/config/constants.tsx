export const MIN_CREATOR_AGE_IN_YEARS = 18

export const CREATOR_STEPS = {
  CUSTOMIZE: "CUSTOMIZE",
  VERIFICATION: "VERIFICATION",
  PAYMENT: "PAYMENT"
}

export const CREATOR_STEPS_TEXT = {
  [CREATOR_STEPS.CUSTOMIZE]: {
    number: "01",
    title: "Customize Page",
    subtitle: "Tell us more"
  },
  [CREATOR_STEPS.VERIFICATION]: {
    number: "02",
    title: "Identity Verification",
    subtitle: "Verify your identity"
  },
  [CREATOR_STEPS.PAYMENT]: {
    number: "03",
    title: "Receive Payment",
    subtitle: "Banking information"
  }
}

export const MAX_SCHEDULE_DURATION_IN_MONTHS = 6
