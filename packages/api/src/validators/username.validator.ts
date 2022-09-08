import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

import { USERNAME_BLOCKLIST } from '../modules/user/constants/username-blocklist'

@ValidatorConstraint({ name: 'IsNotBlocklistedUsername', async: false })
export class IsNotBlocklistedUsername implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    return !USERNAME_BLOCKLIST.has(text)
  }

  defaultMessage() {
    return 'This username is unavailable.'
  }
}
