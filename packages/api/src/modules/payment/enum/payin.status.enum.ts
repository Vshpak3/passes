export enum PayinStatusEnum {
  REGISTERED = 'registered',
  CREATED = 'created',
  PENDING = 'pending',

  SUCCESSFUL = 'successful',

  FAILED = 'failed',
  UNREGISTERED = 'unregistered',

  ACTION_REQUIRED = 'action_required',

  REVERTED = 'reverted', //TODO: implement payment reversals

  FAIL_CALLBACK_FAILED = 'fail_callback_failed', // should not happen, but helps debug callbacks
  SUCCESS_CALLBACK_FAILED = 'success_callback_failed', // should not happen, but helps debug callbacks
  CREATE_CALLBACK_FAILED = 'create_callback_failed', // should not happen, but helps debug callbacks
}
