import { string } from "yup"

const socialMediaValidationInfo = {
  discordUsername: {
    name: "Discord",
    regex: /^.{2,32}#\d{4}$/
  },
  facebookUsername: {
    name: "Facebook",
    regex: /^[A-z\d.]{5,}$/
  },
  instagramUsername: {
    name: "Instagram",
    regex: /^\w(?!.*?\.{2})[\w.]{1,28}\w$/
  },
  twitterUsername: {
    name: "Twitter",
    regex: /^@?[A-z\d_]{1,15}$/
  },
  tiktokUsername: {
    name: "Tiktok",
    regex: /^[A-z\d.]{3,}$/
  },
  twitchUsername: {
    name: "Twitch",
    regex: /^[A-z\d.]{3,}$/
  },
  youtubeUsername: {
    name: "Youtube",
    regex: /^[A-z\d.]{3,}$/
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
