import ChatIcon from "public/icons/mail-icon.svg"
import Discord from "public/icons/profile-discord-icon.svg"
import Facebook from "public/icons/profile-facebook-icon.svg"
import Instagram from "public/icons/profile-instagram-icon.svg"
import TikTok from "public/icons/profile-tiktok-icon.svg"
import Twitch from "public/icons/profile-twitch-icon.svg"
import Twitter from "public/icons/profile-twitter-icon.svg"
import Youtube from "public/icons/profile-youtube-icon.svg"
import { PassesPinkButton } from "src/components/atoms"
import {
  ButtonTypeEnum,
  CoverButton,
  RoundedIconButton
} from "src/components/atoms/Button"
import { compactNumberFormatter, ContentService } from "src/helpers"
import { useFollow } from "src/hooks"

export const Verified = ({ isVerified }: any) => (
  <div className="align-items flex items-center justify-self-start p-4 text-passes-gray-100">
    <span className="text-[12px] font-semibold md:pl-2 md:text-sm">
      {isVerified ? "Verified" : "Not Verified"}
    </span>
  </div>
)

const ProfileStatItemMobile = ({ stat, label }: any) => (
  <div className="grid grid-rows-2">
    <span className="text-[14px] font-medium text-passes-white-100">
      {stat ?? "-"}
    </span>
    <span className="text-[12px] font-normal text-passes-white-100/60">
      {label ?? "-"}
    </span>
  </div>
)

export const ProfileStatsMobile = ({ posts, likes }: any) => (
  <div className="align-center grid grid-cols-3 items-center text-center">
    <ProfileStatItemMobile stat={posts} label="POSTS" />
    <div className="mx-[30px] h-[38px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemMobile stat={compactNumberFormatter(likes)} label="LIKES" />
  </div>
)

interface ProfileImageProps {
  userId: string
}

export const ProfileImage = ({ userId }: ProfileImageProps) => (
  <div className="align-items relative h-[116px] w-[116px] overflow-hidden rounded-full border-2 border-black bg-[#a78df0] bg-gray-200 drop-shadow-profile-photo md:col-span-1 md:flex md:h-[138px] md:w-[138px] md:-translate-y-[75px] md:items-center md:justify-center">
    <img
      src={ContentService.profileThumbnail(userId)}
      className="object-cover drop-shadow-profile-photo"
      alt=""
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = "" // TODO: consider adding default image
      }}
    />
  </div>
)

export const ProfileThumbnail = ({ userId }: ProfileImageProps) => (
  <div className="align-items flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#a78df0] p-[10px]">
    <p className="table-cell text-center text-[18px] font-bold no-underline ">
      <img
        src={ContentService.profileThumbnail(userId)}
        alt=""
        onError={({ currentTarget }) => {
          currentTarget.onerror = null
          currentTarget.src = "" // TODO: consider adding default image
        }}
      />
    </p>
  </div>
)

export const ProfileInformation = ({
  displayName,
  username,
  quote,
  posts,
  likes,
  creatorId,
  ownsProfile,
  discordUsername,
  facebookUsername,
  instagramUsername,
  tiktokUsername,
  twitchUsername,
  twitterUsername,
  youtubeUsername,
  onChat
}: any) => {
  const { follow, unfollow, isFollowing } = useFollow(creatorId)

  return (
    <div className="flex flex-col items-start gap-[6px]">
      <div className="grid grid-cols-2 items-center justify-around md:w-[60%] sidebar-collapse:w-full">
        <span className="text-[32px] font-medium leading-9 text-passes-white-100">
          {displayName}
        </span>
        {/* <Verified /> */}
      </div>
      <div className="flex w-full justify-between">
        <div className="my-2 flex cursor-pointer items-center justify-center rounded-[50px] bg-passes-white-100/[0.05] px-3 py-[6px]">
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
              type={ButtonTypeEnum.SUBMIT}
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
            <span className="mr-[6px] text-base font-medium text-passes-white-100">
              {posts ?? "-"}
            </span>
            <span className="text-sm font-normal text-passes-white-100/70">
              POSTS
            </span>
          </div>
          <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
          <div className="flex items-center justify-center">
            <span className="mr-[6px] text-base font-medium text-passes-white-100">
              {compactNumberFormatter(likes) ?? "-"}
            </span>
            <span className="text-sm font-normal text-passes-white-100/70">
              LIKES
            </span>
          </div>
        </div>

        <ProfileSocialMedia
          discordUsername={discordUsername}
          facebookUsername={facebookUsername}
          instagramUsername={instagramUsername}
          tiktokUsername={tiktokUsername}
          twitchUsername={twitchUsername}
          twitterUsername={twitterUsername}
          youtubeUsername={youtubeUsername}
        />
      </div>
    </div>
  )
}

export const EditProfileAction = ({ onEditProfile }: any) => (
  <div className="absolute top-10 right-0 items-center justify-between">
    <CoverButton className="px-4" name="Edit profile" onClick={onEditProfile} />
  </div>
)

export const ProfileInformationMobile = ({
  displayName,
  username,
  description,
  discordUsername,
  facebookUsername,
  instagramUsername,
  tiktokUsername,
  twitchUsername,
  twitterUsername,
  youtubeUsername,
  onChat,
  creatorId,
  ownsProfile,
  posts,
  likes
}: any) => {
  const { follow, unfollow, isFollowing } = useFollow(creatorId)

  return (
    <>
      <span className="text-[18px] font-semibold text-passes-white-100">
        {displayName}
      </span>
      <div className="align-items flex h-[23px] w-[62px] items-center justify-center rounded-xl bg-passes-white-100/5">
        <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-center text-sm font-normal text-transparent">
          @{username}
        </span>
      </div>
      <span className="max-w-[300px] text-center text-[14px] font-semibold text-white">
        {description}
      </span>
      <ProfileSocialMedia
        discordUsername={discordUsername}
        facebookUsername={facebookUsername}
        instagramUsername={instagramUsername}
        tiktokUsername={tiktokUsername}
        twitchUsername={twitchUsername}
        twitterUsername={twitterUsername}
        youtubeUsername={youtubeUsername}
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
            name={isFollowing ? "Unfollow" : "Follow"}
            type={ButtonTypeEnum.SUBMIT}
            onClick={isFollowing ? unfollow : follow}
            className="h-[36px] w-[115px]"
          />
        </div>
      )}
    </>
  )
}

export const ProfileSocialMedia = ({
  discordUsername,
  facebookUsername,
  instagramUsername,
  tiktokUsername,
  twitchUsername,
  twitterUsername,
  youtubeUsername
}: any) => (
  <div className="flex cursor-pointer items-center justify-center gap-3">
    {facebookUsername && (
      <a
        href={`https://www.facebook.com/${facebookUsername}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook className="h-[22px] w-[22px]" />
      </a>
    )}
    {instagramUsername && (
      <a
        href={`https://www.instagram.com/${instagramUsername}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram className="h-[22px] w-[22px]" />
      </a>
    )}
    {twitterUsername && (
      <a
        href={`https://www.twitter.com/${twitterUsername}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter className="h-[22px] w-[22px]" />
      </a>
    )}
    {discordUsername && (
      <a
        href={`https://www.discord.gg/${discordUsername}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Discord className="h-[22px] w-[22px]" />
      </a>
    )}
    {youtubeUsername && (
      <a
        href={`https://www.youtube.com/c/${youtubeUsername}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Youtube className="h-[22px] w-[22px]" />
      </a>
    )}
    {twitchUsername && (
      <a
        href={`https://www.twitch.com/${twitchUsername}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitch className="h-[22px] w-[22px]" />
      </a>
    )}
    {tiktokUsername && (
      <a
        href={`https://www.tiktok.com/${tiktokUsername}?lang=en`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TikTok className="h-[22px] w-[22px]" />
      </a>
    )}
  </div>
)
