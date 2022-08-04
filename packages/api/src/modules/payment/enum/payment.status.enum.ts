export enum PaymentStatusEnum {
  REGISTERED,
  CREATED,
  PENDING,

  SUCCESSFUL,

  FAILED,
  TIMED_OUT,

  FAIL_CALLBACK_FAILED, // should not happen, but helps debug callbacks
  SUCCESS_CALLBACK_FAILED, // should not happen, but helps debug callbacks
}
