import { Matches } from 'class-validator'

export class SearchUserRequestDto {
  @Matches('[a-z0-9_\\s]+')
  query: string
}
