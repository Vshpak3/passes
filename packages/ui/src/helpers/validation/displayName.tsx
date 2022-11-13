import { USER_DISPLAY_NAME_LENGTH } from "@passes/shared-constants"
import { string } from "yup"

export const displayNameSchema = {
  displayName: string()
    .transform((value) => value.trim())
    .required("Please enter a display name")
    .max(
      USER_DISPLAY_NAME_LENGTH,
      `Display name cannot exceed ${USER_DISPLAY_NAME_LENGTH} characters`
    )
}
