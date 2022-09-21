import { boolean, mixed, number, object, ref, SchemaOf, string } from "yup"

// eslint-disable-next-line regexp/optimal-lookaround-quantifier
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/
const phoneRegex =
  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/no-dupe-disjunctions
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}$/

const digitsOnly = (value: string | any) => /^\d+$/.test(value)

const sanitizeString = (txt: string) =>
  txt.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/g, "")

export interface SignInSchema {
  email: string
  password: string
}

const changePasswordSchema = object({
  currentPassword: string().required("Please enter your current password"),
  password: string()
    .required("Please enter a new password")
    .matches(
      passwordRegex,
      "Your password must include:\n* At least 8 characters\n* A number\n* An uppercase and a lowercase character\n* A special character (!, @, #, $, etc.)"
    ),
  confirmPassword: string().oneOf(
    [ref("password"), null],
    "Passwords must match"
  )
})

const chatSettingsSchema = object({
  withoutTip: boolean(),
  showWelcomeMessageInput: boolean(),
  tipAmount: mixed().when("withoutTip", {
    is: false,
    then: number()
      .min(5, "minimum tip amount is $5")
      .required("Please enter tip amount")
  }),
  welcomeMessage: string().when("showWelcomeMessageInput", {
    is: true,
    then: string().required("Please enter welcome message")
  })
})

const signInSchema: SchemaOf<SignInSchema> = object({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: string().required("Please enter a password")
})

export interface SignUpSchema {
  email: string
  givenName: string
  familyName: string
  password: string
}

const signUpSchema: SchemaOf<SignUpSchema> = object({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  givenName: string().required("Please enter a first name"),
  familyName: string().required("Please enter a last name"),
  password: string()
    .required("Please enter a password")
    .matches(
      passwordRegex,
      "Your password must include:\n* At least 8 characters\n* A number\n* An uppercase and a lowercase character\n* A special character (!, @, #, $, etc.)"
    )
})

export interface CreditCardSchema {
  cardNumber: string
  cvv: string
  cardholderName: string
  expiryMonth: string
  expiryYear: string
  billingAddress: string
  alternativeAddress: string | undefined
  city: string | undefined
  country: string | undefined
  district: string | undefined
  postalCode: string | undefined
  email: string | undefined
}

const creditCardSchema: SchemaOf<CreditCardSchema> = object({
  cardNumber: string().max(19).required("Enter a card number"),
  cvv: string().min(3).max(4).required(),
  cardholderName: string().required(),
  expiryMonth: string().min(2).max(2).required(),
  expiryYear: string().min(4).max(4).required(),
  billingAddress: string().min(4).required(),
  alternativeAddress: string(),
  city: string(),
  country: string().min(2).max(2),
  district: string(),
  postalCode: string(),
  email: string().email()
})

export interface BankingSchema {
  accountNumber: string
  routingNumber: string
  beneficiaryName: string
  city: string | undefined
  country: string | undefined
  accountType: string | undefined
  billingAddress: string
  alternativeAddress: string | undefined
  district: string | undefined
  postalCode: string | undefined
  email: string | undefined
  bankAddress: {
    country: string
  }
}

const bankingSchema: SchemaOf<BankingSchema> = object({
  accountNumber: string().min(5).max(19).required("Enter a card number"),
  routingNumber: string().max(19).required("Enter a card number"),
  beneficiaryName: string().required(),
  city: string(),
  country: string().min(2).max(2),
  accountType: string(),
  billingAddress: string().min(4).required(),
  alternativeAddress: string(),
  district: string(),
  postalCode: string(),
  email: string().email(),
  bankAddress: object().shape({
    // bankName: string().min(2).required("Enter a bank name"),
    // city: string().min(2).required("Enter a bank city"),
    country: string()
      .min(2)
      .max(2)
      .matches(/^[A-Z]{2}$/)
      .required("Enter a bank country code")
  })
})

export interface WalletSchema {
  walletAddress: string
  chain: string | undefined
}

const walletSchema: SchemaOf<WalletSchema> = object({
  walletAddress: string().required("Enter a wallet address"),
  chain: string()
})

export {
  bankingSchema,
  changePasswordSchema,
  chatSettingsSchema,
  creditCardSchema,
  digitsOnly,
  passwordRegex,
  phoneRegex,
  sanitizeString,
  signInSchema,
  signUpSchema,
  walletSchema
}
