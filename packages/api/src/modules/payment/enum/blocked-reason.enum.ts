export enum BlockedReasonEnum {
  PAYMENTS_DEACTIVATED = 'payments deactivated',
  NO_PRICE = 'no price',
  PURCHASE_IN_PROGRESS = 'purchase in progress',
  TOO_MANY = 'too many purchases in progress',
  ALREADY_HAS_ACCESS = 'already has access',
  IS_NOT_PASSHOLDER = 'is not passholder',
  ALREADY_OWNS_PASS = 'already owns pass',
  USER_BLOCKED = 'user blocked',
  INSUFFICIENT_TIP = 'insufficient tip',
  INSUFFICIENT_SUPPLY = 'insufficient supply',
  DOES_NOT_FOLLOW = 'does not follow',
}
