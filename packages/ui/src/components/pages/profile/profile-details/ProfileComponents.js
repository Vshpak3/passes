import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import VerticalSplitter from "public/icons/profile-vertical-splitter.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import LogoSmall from "public/icons/sidebar-logo-small.svg"
import React from "react"
import { compactNumberFormatter } from "src/helpers"

export const Verified = ({ isVerified }) => (
  <div className="flex items-center self-start">
    <LogoSmall className="flex-no-shrink h-[28px] w-[28px] fill-current" />
    <span className="pl-2 text-sm font-medium">
      {isVerified ? "Verified" : "Not Verified"}
    </span>
  </div>
)

export const ProfilePhoto = ({ url }) => (
  <div className="flex cursor-pointer items-center justify-center">
    <img // eslint-disable-line @next/next/no-img-element
      src={url}
      className="-mt-[10px] max-h-[98px] min-h-[98px] min-w-[98px] max-w-[98px] rounded-full border border-black object-cover drop-shadow-profile-photo"
      width="98"
      height="98"
      alt=""
    />
  </div>
)

export const ProfileInformation = ({ displayName, userId, description }) => (
  <div className="flex flex-col items-center justify-center gap-[6px] pt-4">
    <span className="text-center text-base font-medium leading-[19px]">
      {displayName}
    </span>
    <div className="flex cursor-pointer items-center justify-center rounded-[50px] bg-[#ffffff]/[0.05] px-3 py-[6px]">
      <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-sm font-normal leading-[14px] text-transparent">
        {userId}
      </span>
    </div>
    <span className="text-sm font-normal leading-[17px] text-[#ffffff]/30">
      {description}
    </span>
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
  <div className="flex cursor-pointer items-center justify-center gap-3 pt-6">
    {facebookUrl && (
      <a
        href={`https://www.facebook.com/${facebookUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook />
      </a>
    )}
    {instagramUrl && (
      <a
        href={`https://www.instagram.com/${instagramUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram />
      </a>
    )}
    {twitterUrl && (
      <a
        href={`https://www.twitter.com/${twitterUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter />
      </a>
    )}
    {discordUrl && (
      <a
        href={`https://www.discord.gg/${discordUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Discord />
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

export const ProfileAdditionalInformation = ({ posts, likes }) => (
  <div className="grid grid-cols-3 place-items-center pt-14">
    <div className="flex flex-col items-center justify-center">
      <span className="text-base font-medium">{posts}</span>
      <span className="text-sm font-normal text-[#ffffff]/30">POSTS</span>
    </div>
    <VerticalSplitter />
    <div className="flex flex-col items-center justify-center">
      <span className="text-base font-medium">
        {compactNumberFormatter(likes)}
      </span>
      <span className="text-sm font-normal text-[#ffffff]/30">LIKES</span>
    </div>
  </div>
)
