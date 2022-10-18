import { GetUserResponseDto } from "@passes/api-client"
import { differenceInYears } from "date-fns"
import { MIN_CREATOR_AGE_IN_YEARS } from "src/config/age"

export const isOver18 = (user?: GetUserResponseDto) =>
  user?.birthday
    ? differenceInYears(new Date(), new Date(user?.birthday)) >=
      MIN_CREATOR_AGE_IN_YEARS
    : false
