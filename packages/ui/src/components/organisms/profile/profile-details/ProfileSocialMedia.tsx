import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import { FC } from "react"
import { formatText } from "src/helpers/formatters"

const socialUsernameToUrl = {
  discordUsername: (u: string) => `https://www.discord.gg/${u}`,
  facebookUsername: (u: string) => `https://www.facebook.com/${u}`,
  instagramUsername: (u: string) => `https://www.instagram.com/${u}`,
  tiktokUsername: (u: string) => `https://www.tiktok.com/${u}?lang=en`,
  twitchUsername: (u: string) => `https://www.twitch.com/${u}`,
  twitterUsername: (u: string) => `https://www.twitter.com/${u}`,
  youtubeUsername: (u: string) => `https://www.youtube.com/c/${u}`
}

const socialUsernameToComponents = {
  discordUsername: () => <Discord className="h-[22px] w-[22px]" />,
  facebookUsername: () => <Facebook className="h-[22px] w-[22px]" />,
  instagramUsername: () => <Instagram className="h-[22px] w-[22px]" />,
  tiktokUsername: () => <TikTok className="h-[22px] w-[22px]" />,
  twitchUsername: () => <Twitch className="h-[22px] w-[22px]" />,
  twitterUsername: () => <Twitter className="h-[22px] w-[22px]" />,
  youtubeUsername: () => <Youtube className="h-[22px] w-[22px]" />
}

interface ProfileSocialMediaButtonProps {
  type: keyof typeof socialUsernameToUrl
  username: string
}

export const ProfileSocialMediaButton: FC<ProfileSocialMediaButtonProps> = ({
  type,
  username
}) => (
  <>
    {username && (
      <a
        href={formatText(socialUsernameToUrl[type](username))}
        target="_blank"
        rel="noopener noreferrer"
      >
        {socialUsernameToComponents[type]()}
      </a>
    )}
  </>
)

export interface ProfileSocialMediaProps {
  discordUsername: string | undefined | null
  facebookUsername: string | undefined | null
  instagramUsername: string | undefined | null
  tiktokUsername: string | undefined | null
  twitchUsername: string | undefined | null
  twitterUsername: string | undefined | null
  youtubeUsername: string | undefined | null
}

export const ProfileSocialMedia: FC<ProfileSocialMediaProps> = (props) => (
  <div className="flex cursor-pointer items-center justify-center gap-3">
    {Object.entries(props).map(([type, username]) => (
      <ProfileSocialMediaButton
        key={type}
        type={type as any}
        username={username}
      />
    ))}
  </div>
)
