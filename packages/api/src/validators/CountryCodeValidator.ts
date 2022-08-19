import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import iso3311a2 from 'iso-3166-1-alpha-2'

@ValidatorConstraint({ name: 'IsValidCountryCode', async: false })
export class IsValidCountryCode implements ValidatorConstraintInterface {
  validate(text: string) {
    return !!iso3311a2.getCountry(text)
  }

  defaultMessage() {
    return 'This country code is invalid.'
  }
}
