import * as yup from "yup"

// eslint-disable-next-line regexp/optimal-lookaround-quantifier
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/
const phoneRegex =
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-dupe-disjunctions
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}$/

const digitsOnly = (value) => /^\d+$/.test(value)

const sanitizeString = (txt) =>
  txt.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/g, "")

const signInSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: yup.string().required("Please enter a password")
})

const signUpSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  givenName: yup.string().required("Please enter a first name"),
  familyName: yup.string().required("Please enter a last name"),
  password: yup
    .string()
    .required("Please enter a password")
    .matches(
      passwordRegex,
      "Your password must include:\n* At least 8 characters\n* A number\n* An uppercase and a lowercase character\n* A special character (!, @, #, $, etc.)"
    )
})

const creditCardSchema = yup.object({
  cardNumber: yup.string().max(19).required("Enter a card number"),
  cvv: yup.string().min(3).max(4).required(),
  cardholderName: yup.string().required(),
  expiryMonth: yup.string().min(2).max(2).required(),
  expiryYear: yup.string().min(4).max(4).required(),
  billingAddress: yup.string().min(4).required(),
  alternativeAddress: yup.string(),
  city: yup.string(),
  country: yup.string().min(2).max(2),
  district: yup.string(),
  postalCode: yup.string(),
  email: yup.string().email()
})

const bankingSchema = yup.object({
  routingNumber: yup.string().max(19).required("Enter a card number"),
  accountNumber: yup.string().max(19).required("Enter a card number"),
  accountType: yup.string(),
  billingAddress: yup.string().min(4).required(),
  alternativeAddress: yup.string(),
  city: yup.string(),
  country: yup.string().min(2).max(2),
  district: yup.string(),
  postalCode: yup.string(),
  email: yup.string().email()
})

const walletSchema = yup.object({
  walletAddress: yup.string().max(19).required("Enter a wallet address"),
  chain: yup.string()
})

export {
  bankingSchema,
  creditCardSchema,
  digitsOnly,
  passwordRegex,
  phoneRegex,
  sanitizeString,
  signInSchema,
  signUpSchema,
  walletSchema
}
