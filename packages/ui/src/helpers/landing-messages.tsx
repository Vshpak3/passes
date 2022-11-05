export enum LandingStatusEnum {
  SUCCESS = "success",
  FAILURE = "failure"
}

export enum LandingMessageEnum {
  PASS_PURCHASE = "passPurchase",
  PURCHASE = "purchase",
  TIP = "tip"
}

export const LANDING_MESSAGES: Record<
  LandingStatusEnum,
  Record<LandingMessageEnum, string>
> = {
  [LandingStatusEnum.SUCCESS]: {
    [LandingMessageEnum.PASS_PURCHASE]:
      "Thank you for you purchase, your membership card is minting now",
    [LandingMessageEnum.PURCHASE]:
      "Thank you for you purchase, you will have access soon",
    [LandingMessageEnum.TIP]: "Your tip was cancelled"
  },
  [LandingStatusEnum.FAILURE]: {
    [LandingMessageEnum.PASS_PURCHASE]:
      "Your membership purchase was cancelled",
    [LandingMessageEnum.PURCHASE]: "Your purchase was cancelled",
    [LandingMessageEnum.TIP]: "Your tip was cancelled"
  }
}
