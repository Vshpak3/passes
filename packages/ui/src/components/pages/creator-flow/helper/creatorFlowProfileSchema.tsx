import { SOCIAL_MEDIA_USERNAME_REGEX } from "src/helpers/validation"
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
