import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import { FC } from "react"

import { formatTextToString } from "src/helpers/formatters"

export const SocialUsernames = {
  discordUsername: true,
  facebookUsername: true,
  instagramUsername: true,
  tiktokUsername: true,
  twitchUsername: true,
  twitterUsername: true,
  youtubeUsername: true
}

const socialUsernameToUrl: Record<
  keyof typeof SocialUsernames,
  (u: string) => string
> = {
  discordUsername: (u: string) => `https://www.discord.gg/${u}`,
  facebookUsername: (u: string) => `https://www.facebook.com/${u}`,
  instagramUsername: (u: string) => `https://www.instagram.com/${u}`,
  tiktokUsername: (u: string) => `https://www.tiktok.com/${u}?lang=en`,
  twitchUsername: (u: string) => `https://www.twitch.com/${u}`,
  twitterUsername: (u: string) => `https://www.twitter.com/${u}`,
  youtubeUsername: (u: string) => `https://www.youtube.com/c/${u}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socialUsernameToIcon: Record<keyof typeof SocialUsernames, any> = {
  discordUsername: Discord,
  facebookUsername: Facebook,
  instagramUsername: Instagram,
  tiktokUsername: TikTok,
  twitchUsername: Twitch,
  twitterUsername: Twitter,
  youtubeUsername: Youtube
}

interface ProfileSocialMediaButtonProps {
  type: keyof typeof SocialUsernames
  username: string | undefined | null
}

const ProfileSocialMediaButton: FC<ProfileSocialMediaButtonProps> = ({
  type,
  username
}) => {
  const Icon = socialUsernameToIcon[type]
  return (
    <>
      {username && (
        <a
          href={formatTextToString(socialUsernameToUrl[type](username))}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon className="h-[22px] w-[22px]" />
        </a>
      )}
    </>
  )
}

type ProfileSocialMediaProps = Record<
  keyof typeof SocialUsernames,
  string | undefined | null
>

export const ProfileSocialMedia: FC<ProfileSocialMediaProps> = (props) => (
  <div className="flex cursor-pointer items-center justify-center gap-3">
    {Object.entries(props).map(([type, username]) => (
      <ProfileSocialMediaButton
        key={type}
        type={type as keyof ProfileSocialMediaProps}
        username={username}
      />
    ))}
  </div>
)
