export enum PayinStatusEnum {
  REGISTERED = 'registered',

  CREATED_READY = 'created_ready',
  CREATED = 'created',
  UNCREATED_READY = 'uncreated_ready',
  UNCREATED = 'uncreated',
  PENDING = 'pending',

  SUCCESSFUL_READY = 'successful_ready',
  SUCCESSFUL = 'successful',

  FAILED_READY = 'failed_ready',
  FAILED = 'failed',
  UNREGISTERED = 'unregistered',

  ACTION_REQUIRED = 'action_required',

  REVERTED = 'reverted', // TODO: implement payment reversals

  FAIL_CALLBACK_FAILED = 'fail_callback_failed', // should not happen, but helps debug callbacks
  SUCCESS_CALLBACK_FAILED = 'success_callback_failed', // should not happen, but helps debug callbacks
  CREATE_CALLBACK_FAILED = 'create_callback_failed', // should not happen, but helps debug callbacks
}

export const PAYIN_TARGET_BLOCKING_STATUSES = [
  PayinStatusEnum.CREATED_READY,
  PayinStatusEnum.CREATED,
  PayinStatusEnum.PENDING,
  PayinStatusEnum.SUCCESSFUL_READY,
  PayinStatusEnum.FAILED_READY,
  PayinStatusEnum.ACTION_REQUIRED,
]

export const PAYIN_INVISIBLE_STATUSES = [
  PayinStatusEnum.REGISTERED,
  PayinStatusEnum.UNREGISTERED,
  PayinStatusEnum.UNCREATED,
  PayinStatusEnum.UNCREATED_READY,
  PayinStatusEnum.CREATED_READY,
]

export const PAYIN_IN_PROGRESS_STATUSES = [
  PayinStatusEnum.CREATED_READY,
  PayinStatusEnum.CREATED,
  PayinStatusEnum.PENDING,
  PayinStatusEnum.SUCCESSFUL_READY,
  PayinStatusEnum.ACTION_REQUIRED,
]
