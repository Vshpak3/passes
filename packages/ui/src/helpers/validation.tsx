import { object, string } from "yup"

export const getYupRequiredStringSchema = ({
  name,
  errorMessage
}: {
  name: string
  errorMessage?: string
}) => {
  return object({
    [name]: string()
      .transform((value) => value.trim())
      .required(errorMessage || `Please enter a ${name}`)
  })
}
