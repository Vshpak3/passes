import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import LogoSmall from "public/icons/sidebar-logo-small.svg"
import React from "react"
import { compactNumberFormatter } from "src/helpers"

export const Verified = ({ isVerified }) => (
  <div className="flex translate-y-[4px] items-center self-start">
    <LogoSmall className="flex-no-shrink h-[28px] w-[28px] fill-current" />
    <span className="pl-2 text-sm font-medium">
      {isVerified ? "Verified" : "Not Verified"}
    </span>
  </div>
)

export const ProfilePhoto = ({ url }) => (
  <div className="flex cursor-pointer">
    <img // eslint-disable-line @next/next/no-img-element
      src={url}
      className="max-h-[138px] min-h-[138px] min-w-[138px] max-w-[138px] -translate-y-[69px] rounded-full border border-black object-cover drop-shadow-profile-photo"
      width="136"
      height="136"
      alt=""
    />
  </div>
)

export const ProfileInformation = ({
  displayName,
  username,
  quote,
  posts,
  likes,
  instagramUrl,
  tiktokUrl,
  youtubeUrl,
  discordUrl,
  twitchUrl,
  facebookUrl,
  twitterUrl
}) => (
  <div className="flex flex-col items-start gap-[6px]">
    <div className="flex items-center justify-center gap-4">
      <span className="text-[32px] font-medium leading-9">{displayName}</span>
      <Verified />
    </div>
    <div className="my-2 flex cursor-pointer items-center justify-center rounded-[50px] bg-[#ffffff]/[0.05] px-3 py-[6px]">
      <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-sm font-normal leading-[14px] text-transparent">
        @{username}
      </span>
    </div>
    <span className="text-md mb-3 font-semibold leading-[22px] text-white">
      {quote}
    </span>
    <div className="flex w-full flex-row items-center gap-[68px]">
      <div className="flex items-center">
        <div className="flex items-center justify-center">
          <span className="mr-[6px] text-base font-medium">{posts}</span>
          <span className="text-sm font-normal text-[#ffffff]/30">POSTS</span>
        </div>
        <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
        <div className="flex items-center justify-center">
          <span className="mr-[6px] text-base font-medium">
            {compactNumberFormatter(likes)}
          </span>
          <span className="text-sm font-normal text-[#ffffff]/30">LIKES</span>
        </div>
      </div>

      <ProfileSocialMedia
        instagramUrl={instagramUrl}
        tiktokUrl={tiktokUrl}
        youtubeUrl={youtubeUrl}
        discordUrl={discordUrl}
        twitchUrl={twitchUrl}
        facebookUrl={facebookUrl}
        twitterUrl={twitterUrl}
      />
    </div>
  </div>
)

export const ProfileSocialMedia = ({
  instagramUrl,
  tiktokUrl,
  youtubeUrl,
  discordUrl,
  twitchUrl,
  facebookUrl,
  twitterUrl
}) => (
  <div className="flex cursor-pointer items-center justify-center gap-3">
    {facebookUrl && (
      <a
        href={`https://www.facebook.com/${facebookUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook className="h-[22px] w-[22px]" />
      </a>
    )}
    {instagramUrl && (
      <a
        href={`https://www.instagram.com/${instagramUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram className="h-[22px] w-[22px]" />
      </a>
    )}
    {twitterUrl && (
      <a
        href={`https://www.twitter.com/${twitterUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter className="h-[22px] w-[22px]" />
      </a>
    )}
    {discordUrl && (
      <a
        href={`https://www.discord.gg/${discordUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Discord className="h-[22px] w-[22px]" />
      </a>
    )}
    {youtubeUrl && (
      <a
        href={`https://www.youtube.com/c/${youtubeUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Youtube className="h-[22px] w-[22px]" />
      </a>
    )}
    {twitchUrl && (
      <a
        href={`https://www.twitch.com/${twitchUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitch className="h-[22px] w-[22px]" />
      </a>
    )}
    {tiktokUrl && (
      <a
        href={`https://www.tiktok.com/${tiktokUrl}?lang=en`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TikTok className="h-[22px] w-[22px]" />
      </a>
    )}
  </div>
)
