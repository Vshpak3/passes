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

export const FULL_NAME_REGEX = /^[A-Za-z-,'\s]+$/

export const SOCIAL_MEDIA_USERNAME_REGEX = {
  discord: /^.{2,32}#\d{4}$/,
  facebook: /^[a-zA-Z\d.]{5,}$/,
  instagram: /^\w(?!.*?\.{2})[\w.]{1,28}\w$/,
  twitter: /^(@)?([a-z\d_]{1,15})$/,
  tiktok: /^[a-zA-Z\d.]{3,}$/,
  twitch: /^[a-zA-Z\d.]{3,}$/,
  youtube: /^[a-zA-Z\d.]{3,}$/
}

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
