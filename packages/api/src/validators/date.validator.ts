import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

// eslint-disable-next-line regexp/no-unused-capturing-group
const DATE_REGEX = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/

@ValidatorConstraint({ name: 'IsOnlyDate', async: false })
export class IsOnlyDate implements ValidatorConstraintInterface {
  validate(text: string): boolean {
    return DATE_REGEX.test(text)
  }

  defaultMessage() {
    return 'Please provide only date like 2020-12-08.'
  }
}
