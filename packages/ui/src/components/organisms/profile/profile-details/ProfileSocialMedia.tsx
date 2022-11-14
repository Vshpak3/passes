// import DiscordIcon from "public/icons/social/discord.svg"
import FacebookIcon from "public/icons/social/facebook.svg"
import InstagramIcon from "public/icons/social/instagram.svg"
import TikTokIcon from "public/icons/social/tiktok.svg"
import TwitchIcon from "public/icons/social/twitch.svg"
import TwitterIcon from "public/icons/social/twitter.svg"
import YoutubeIcon from "public/icons/social/youtube.svg"
import { FC } from "react"

import { formatTextToString } from "src/helpers/formatters"

// Discord is removed for now

export const SocialUsernames = {
  // discordUsername: true,
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
  // discordUsername: (u: string) => `https://www.discord.gg/${u}`,
  facebookUsername: (u: string) => `https://www.facebook.com/${u}`,
  instagramUsername: (u: string) => `https://www.instagram.com/${u}`,
  tiktokUsername: (u: string) =>
    `https://www.tiktok.com/${u.startsWith("@") ? u : "@" + u}`,
  twitchUsername: (u: string) => `https://www.twitch.com/${u}`,
  twitterUsername: (u: string) => `https://www.twitter.com/${u}`,
  youtubeUsername: (u: string) => `https://www.youtube.com/user/${u}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socialUsernameToIcon: Record<keyof typeof SocialUsernames, any> = {
  // discordUsername: DiscordIcon,
  facebookUsername: FacebookIcon,
  instagramUsername: InstagramIcon,
  tiktokUsername: TikTokIcon,
  twitchUsername: TwitchIcon,
  twitterUsername: TwitterIcon,
  youtubeUsername: YoutubeIcon
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
      {!!username && (
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

// eslint-disable-next-line react/no-multi-comp
export const ProfileSocialMedia: FC<ProfileSocialMediaProps> = (props) => (
  <div className="flex shrink-0 cursor-pointer items-center justify-center gap-2 md:gap-3">
    {Object.entries(props).map(([type, username]) => (
      <ProfileSocialMediaButton
        key={type}
        type={type as keyof ProfileSocialMediaProps}
        username={username}
      />
    ))}
  </div>
)
