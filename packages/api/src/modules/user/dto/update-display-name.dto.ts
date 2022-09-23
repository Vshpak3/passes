import { Length } from 'class-validator'

import { DtoProperty } from '../../../web/dto.web'
import { USER_DISPLAY_NAME_LENGTH } from '../constants/schema'

// "PickType(UserDto, ['displayName'])" does not work since this must be required;
// should figure out a better way around this
export class UpdateDisplayNameRequestDto {
  @Length(1, USER_DISPLAY_NAME_LENGTH)
  @DtoProperty({ optional: true })
  displayName: string
}
