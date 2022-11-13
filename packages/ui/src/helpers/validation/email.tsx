import { string } from "yup"

export const emailSchema = {
  email: string()
    .required("Enter an email address")
    .email("Email address is invalid")
}
