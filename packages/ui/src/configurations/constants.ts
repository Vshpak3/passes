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
    title: "Complete Verification",
    subtitle: "Verifiy it is you"
  },
  [CREATOR_STEPS.PAYMENT]: {
    number: "03",
    title: "Receive Payment",
    subtitle: "Banking information"
  }
}
