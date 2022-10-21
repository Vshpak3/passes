import { socialMediaUsernameSchema } from "src/helpers/validation-social"
import { array, object, string } from "yup"

export const creatorFlowProfileSchema = object({
  displayName: string()
    .transform((name) => name.trim())
    .required("Please enter a display name"),
  description: string()
    .transform((name) => name.trim())
    .required("Please enter a bio"),
  profileImage: array().min(1, "Please upload a profile image"),
  profileBannerImage: array().optional(),
  ...socialMediaUsernameSchema
})
