import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@passes/shared-constants"
import { string } from "yup"

export const passwordSchema = {
  password: string()
    .required("Enter a password")
    .min(
      PASSWORD_MIN_LENGTH,
      `Password should be at least ${PASSWORD_MIN_LENGTH} characters`
    )
    .matches(
      PASSWORD_REGEX,
      "Password must contain at least one letter and number"
    ),
  confirmPassword: string()
    .required("Enter a password")
    .min(
      PASSWORD_MIN_LENGTH,
      `Password should be at least ${PASSWORD_MIN_LENGTH} characters`
    )
    .matches(
      PASSWORD_REGEX,
      "Password must contain at least one letter and number"
    )
    .test("match", "Passwords do not match", function (confirmPassword) {
      return confirmPassword === this?.parent?.password
    })
}
