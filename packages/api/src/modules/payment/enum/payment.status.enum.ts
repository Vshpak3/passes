export enum PaymentStatusEnum {
  UNKOWN = 'unknown', //not sent or not queried
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  FAILED = 'failed',
  ACTION_REQUIRED = 'action_required',
}
