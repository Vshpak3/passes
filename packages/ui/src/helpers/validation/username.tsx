import {
  USER_USERNAME_LENGTH,
  VALID_USERNAME_REGEX
} from "@passes/shared-constants"
import { string } from "yup"

export const usernameSchema = {
  username: string()
    .transform((value) => value.trim())
    .required("Please enter a username")
    .max(
      USER_USERNAME_LENGTH,
      `Username cannot exceed ${USER_USERNAME_LENGTH} characters`
    )
    .matches(
      new RegExp(VALID_USERNAME_REGEX),
      "This username contains invalid characters"
    )
}
