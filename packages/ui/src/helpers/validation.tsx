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

const getYupRequiredStringSchema = ({
  name,
  errorMessage
}: {
  name: string
  errorMessage?: string
}) => {
  return object({
    [name]: string()
      .transform((value) => value.trim())
      .required(errorMessage || `please enter a ${name}`)
  })
}

export const SOCIAL_MEDIA_USERNAME_REGEX = {
  discord: /^.{2,32}#\d{4}$/,
  facebook: /^[a-zA-Z\d.]{5,}$/,
  instagram: /^\w(?!.*?\.{2})[\w.]{1,28}\w$/,
  twitter: /^(@)?([a-z\d_]{1,15})$/,
  tiktok: /^[a-zA-Z\d.]{3,}$/,
  twitch: /^[a-zA-Z\d.]{3,}$/,
  youtube: /^[a-zA-Z\d.]{3,}$/
}

const creatorFlowProfileSchema = object({
  displayName: string()
    .transform((name) => name.trim())
    .required("Please enter a display name"),
  description: string()
    .transform((name) => name.trim())
    .required("Please enter a bio"),
  profileImage: string().required("Please upload a profile image"),
  profileBannerImage: string().required("Please upload a profile banner image"),
  facebookUsername: string()
    .optional()
    .transform((value) => value.trim())
    .test("facebookUsername", "Please enter a valid Facebook username", (v) => {
      if (!v) {
        return true
      }

      return SOCIAL_MEDIA_USERNAME_REGEX.facebook.test(v)
    }),
  instagramUsername: string()
    .optional()
    .transform((value) => value.trim())
    .test(
      "instagramUsername",
      "Please enter a valid Instagram username",
      (v) => {
        if (!v) {
          return true
        }

        return SOCIAL_MEDIA_USERNAME_REGEX.instagram.test(v)
      }
    ),
  twitterUsername: string()
    .optional()
    .transform((value) => value.trim())
    .test("twitterUsername", "Please enter a valid Twitter username", (v) => {
      if (!v) {
        return true
      }

      return SOCIAL_MEDIA_USERNAME_REGEX.twitter.test(v)
    }),
  discordUsername: string()
    .optional()
    .transform((value) => value.trim())
    .test("discordUsername", "Please enter a valid Discord username", (v) => {
      if (!v) {
        return true
      }

      return SOCIAL_MEDIA_USERNAME_REGEX.discord.test(v)
    }),
  tiktokUsername: string()
    .optional()
    .transform((value) => value.trim())
    .test("tiktokUsername", "Please enter a valid TikTok username", (v) => {
      if (!v) {
        return true
      }

      return SOCIAL_MEDIA_USERNAME_REGEX.tiktok.test(v)
    }),
  twitchUsername: string()
    .optional()
    .transform((value) => value.trim())
    .test("twitchUsername", "Please enter a valid Twitch username", (v) => {
      if (!v) {
        return true
      }

      return SOCIAL_MEDIA_USERNAME_REGEX.twitch.test(v)
    }),
  youtubeUsername: string()
    .optional()
    .transform((value) => value.trim())
    .test("youtubeUsername", "Please enter a valid Youtube username", (v) => {
      if (!v) {
        return true
      }

      return SOCIAL_MEDIA_USERNAME_REGEX.youtube.test(v)
    })
})

const changePasswordSchema = object({
  oldPassword: string().required("Please enter your current password"),
  newPassword: string()
    .required("Please enter a new password")
    .matches(
      passwordRegex,
      "Your password must include:\n* At least 8 characters\n* A number\n* An uppercase and a lowercase character\n* A special character (!, @, #, $, etc.)"
    ),
  confirmPassword: string().oneOf(
    [ref("newPassword"), null],
    "Passwords must match"
  )
})

const chatSettingsSchema = object({
  isWithoutTip: boolean(),
  showWelcomeMessageInput: boolean(),
  minimumTipAmount: mixed().when("isWithoutTip", {
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
  creatorFlowProfileSchema,
  creditCardSchema,
  digitsOnly,
  getYupRequiredStringSchema,
  passwordRegex,
  phoneRegex,
  sanitizeString,
  signInSchema,
  signUpSchema,
  walletSchema
}
