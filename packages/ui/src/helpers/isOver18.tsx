import { GetUserResponseDto } from "@passes/api-client"
import { CREATOR_MIN_AGE } from "@passes/shared-constants"
import { differenceInYears } from "date-fns"

export const isOverMinCreatorAge = (user?: GetUserResponseDto) =>
  user?.birthday
    ? differenceInYears(new Date(), new Date(user?.birthday)) >= CREATOR_MIN_AGE
    : false
