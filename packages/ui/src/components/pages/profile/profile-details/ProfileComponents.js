import Image from "next/image"
import ChatIcon from "public/icons/mail-icon.svg"
import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import React from "react"
import { PassesPinkButton } from "src/components/atoms"
import { CoverButton, RoundedIconButton } from "src/components/atoms/Button"
import { compactNumberFormatter } from "src/helpers"
import { useFollow } from "src/hooks"

export const Verified = ({ isVerified }) => (
  <div className="align-items flex items-center justify-self-start p-4 text-passes-gray-100">
    <span className="text-[12px] font-semibold md:pl-2 md:text-sm">
      {isVerified ? "Verified" : "Not Verified"}
    </span>
  </div>
)

const ProfileStatItemMobile = ({ stat, label }) => (
  <div className="grid grid-rows-2">
    <span className="text-passes-white-100 text-[14px] font-medium">
      {stat}
    </span>
    <span className="text-passes-white-100/60 text-[12px] font-normal">
      {label}
    </span>
  </div>
)

export const ProfileStatsMobile = ({ posts, likes }) => (
  <div className="align-center grid grid-cols-3 items-center text-center">
    <ProfileStatItemMobile stat={posts} label="POSTS" />
    <div className="mx-[30px] h-[38px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemMobile stat={compactNumberFormatter(likes)} label="LIKES" />
  </div>
)

export const ProfilePhoto = ({ url }) => (
  <div className="align-items relative h-[116px] w-[116px] overflow-hidden rounded-full border-2 border-black bg-gray-200 drop-shadow-profile-photo md:col-span-1 md:flex md:h-[138px] md:w-[138px] md:-translate-y-[75px] md:items-center md:justify-center">
    {url?.length > 0 && (
      <Image
        src={url}
        className="object-cover drop-shadow-profile-photo"
        layout="fill"
        objectFit="fill"
        alt="profile-image"
      />
    )}
  </div>
)

export const ProfileInformation = ({
  displayName,
  username,
  quote,
  posts,
  likes,
  creatorId,
  instagramUrl,
  tiktokUrl,
  youtubeUrl,
  discordUrl,
  ownsProfile,
  twitchUrl,
  facebookUrl,
  twitterUrl,
  onChat
}) => {
  const { follow, unfollow, isFollowing } = useFollow(creatorId)

  return (
    <div className="flex flex-col items-start gap-[6px]">
      <div className="grid grid-cols-2 items-center justify-around md:w-[60%] sidebar-collapse:w-full">
        <span className="text-passes-white-100 text-[32px] font-medium leading-9">
          {displayName}
        </span>
        {/* <Verified /> */}
      </div>
      <div className="flex w-full justify-between">
        <div className="bg-passes-white-100/[0.05] my-2 flex cursor-pointer items-center justify-center rounded-[50px] px-3 py-[6px]">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-sm font-normal leading-[14px] text-transparent">
            @{username}
          </span>
        </div>
        {!ownsProfile && (
          <div className="align-center flex items-center space-x-3">
            <RoundedIconButton
              className="h-[32px] w-[32px] border border-passes-dark-200 bg-[#0E0A0F] p-0"
              onClick={onChat}
            >
              <ChatIcon />
            </RoundedIconButton>
            <PassesPinkButton
              name={isFollowing ? "Unfollow" : "Follow"}
              type="button"
              onClick={isFollowing ? unfollow : follow}
              className="h-[36px] w-[115px]"
            />
          </div>
        )}
      </div>
      <span className="text-md my-3 font-semibold leading-[22px] text-white">
        {quote}
      </span>
      <div className="flex w-full flex-row items-center gap-[68px]">
        <div className="flex items-center">
          <div className="flex items-center justify-center">
            <span className="text-passes-white-100 mr-[6px] text-base font-medium">
              {posts}
            </span>
            <span className="text-passes-white-100/70 text-sm font-normal">
              POSTS
            </span>
          </div>
          <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
          <div className="flex items-center justify-center">
            <span className="text-passes-white-100 mr-[6px] text-base font-medium">
              {compactNumberFormatter(likes)}
            </span>
            <span className="text-passes-white-100/70 text-sm font-normal">
              LIKES
            </span>
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
}

export const EditProfileAction = ({ onEditProfile }) => (
  <div className="absolute top-10 right-0 items-center justify-between">
    <CoverButton className="px-4" name="Edit profile" onClick={onEditProfile} />
  </div>
)

export const ProfileInformationMobile = ({
  displayName,
  username,
  description,
  instagramUrl,
  tiktokUrl,
  youtubeUrl,
  discordUrl,
  twitchUrl,
  facebookUrl,
  onChat,
  onFollow,
  twitterUrl,
  ownsProfile,
  posts,
  likes
}) => (
  <>
    <span className="text-passes-white-100 text-[18px] font-semibold">
      {displayName}
    </span>
    <div className="align-items bg-passes-white-100/5 flex h-[23px] w-[62px] items-center justify-center rounded-xl">
      <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-center text-sm font-normal text-transparent">
        @{username}
      </span>
    </div>
    <span className="max-w-[300px] text-center text-[14px] font-semibold text-white">
      {description}
    </span>
    <ProfileSocialMedia
      instagramUrl={instagramUrl}
      tiktokUrl={tiktokUrl}
      youtubeUrl={youtubeUrl}
      discordUrl={discordUrl}
      twitchUrl={twitchUrl}
      facebookUrl={facebookUrl}
      twitterUrl={twitterUrl}
    />
    <ProfileStatsMobile posts={posts} likes={likes} />
    {!ownsProfile && (
      <div className="flex space-x-3">
        <RoundedIconButton
          className="h-[36px] w-[36px] border border-passes-dark-200 bg-[#0E0A0F] p-0"
          onClick={onChat}
        >
          <ChatIcon />
        </RoundedIconButton>
        <PassesPinkButton
          name="Follow"
          type="button"
          onClick={onFollow}
          className="h-[36px] w-[115px]"
        />
      </div>
    )}
  </>
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
