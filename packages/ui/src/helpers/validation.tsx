import { boolean, mixed, number, object, SchemaOf, string } from "yup"

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
      .required(errorMessage || `please enter a ${name}`)
  })
}

const socialMediaValidationInfo = {
  discordUsername: {
    name: "Discord",
    regex: /^.{2,32}#\d{4}$/
  },
  facebookUsername: {
    name: "Facebook",
    regex: /^[a-zA-Z\d.]{5,}$/
  },
  instagramUsername: {
    name: "Instagram",
    regex: /^\w(?!.*?\.{2})[\w.]{1,28}\w$/
  },
  twitterUsername: {
    name: "TikTok",
    regex: /^(@)?([a-z\d_]{1,15})$/
  },
  tiktokUsername: {
    name: "Twitch",
    regex: /^[a-zA-Z\d.]{3,}$/
  },
  twitchUsername: {
    name: "Twitter",
    regex: /^[a-zA-Z\d.]{3,}$/
  },
  youtubeUsername: {
    name: "Youtube",
    regex: /^[a-zA-Z\d.]{3,}$/
  }
}

export const socialMediaUsernameSchema = Object.fromEntries(
  Object.entries(socialMediaValidationInfo).map(([k, v]) => [
    k,
    string()
      .optional()
      .transform((value) => value.trim())
      .test(k, `Please enter a valid ${v.name} username`, (value) => {
        if (!value) {
          return true
        }

        return v.regex.test(value)
      })
  ])
)

export const chatSettingsSchema = object({
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

export const creditCardSchema: SchemaOf<CreditCardSchema> = object({
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

export const bankingSchema: SchemaOf<BankingSchema> = object({
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

export const walletSchema: SchemaOf<WalletSchema> = object({
  walletAddress: string().required("Enter a wallet address"),
  chain: string()
})
