import ChatIcon from "public/icons/mail-icon.svg"
import EditIcon from "public/icons/profile-edit-icon.svg"
import { FC } from "react"
import { PassesPinkButton } from "src/components/atoms"
import {
  ButtonTypeEnum,
  CoverButton,
  RoundedIconButton
} from "src/components/atoms/Button"
import { compactNumberFormatter, ContentService } from "src/helpers"
import { useFollow } from "src/hooks"

import {
  ProfileSocialMedia,
  ProfileSocialMediaProps
} from "./ProfileSocialMedia"

interface VerifiedProps {
  isVerified: any
}

export const Verified: FC<VerifiedProps> = ({ isVerified }) => (
  <div className="align-items flex items-center justify-self-start p-4 text-passes-gray-100">
    <span className="text-[12px] font-semibold md:pl-2 md:text-sm">
      {isVerified ? "Verified" : "Not Verified"}
    </span>
  </div>
)

interface ProfileStatItemMobileProps {
  stat: any
  label: any
}

const ProfileStatItemMobile: FC<ProfileStatItemMobileProps> = ({
  stat,
  label
}) => (
  <div className="grid grid-rows-2">
    <span className="text-[14px] font-medium text-passes-white-100">
      {stat ?? "-"}
    </span>
    <span className="text-[12px] font-normal text-passes-white-100/60">
      {label ?? "-"}
    </span>
  </div>
)

interface ProfileStatsMobileProps {
  numPosts: number
  likes: number
}

export const ProfileStatsMobile: FC<ProfileStatsMobileProps> = ({
  numPosts,
  likes
}) => (
  <div className="align-center grid grid-cols-3 items-center text-center">
    <ProfileStatItemMobile stat={numPosts} label="POSTS" />
    <div className="mx-[30px] h-[38px] w-[1px] bg-passes-dark-200" />
    <ProfileStatItemMobile stat={compactNumberFormatter(likes)} label="LIKES" />
  </div>
)

interface ProfileImageProps {
  userId: string
  onClick?: () => void
}

export const ProfileImage = ({ userId, onClick }: ProfileImageProps) => (
  <div
    className="align-items relative h-[116px] w-[116px] cursor-pointer overflow-hidden rounded-full border-2 border-black bg-gray-900 drop-shadow-profile-photo md:col-span-1 md:flex md:h-[138px] md:w-[138px] md:-translate-y-[75px] md:items-center md:justify-center"
    onClick={onClick}
  >
    <img
      src={ContentService.profileThumbnail(userId)}
      className="object-cover drop-shadow-profile-photo"
      alt=""
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = "/img/profile/default-profile-img.svg"
      }}
    />
  </div>
)

export const ProfileThumbnail = ({ userId }: ProfileImageProps) => (
  <div className="h-[42px] w-[42px] overflow-hidden rounded-full bg-gray-900">
    <img
      className="h-full w-full object-cover object-center"
      src={ContentService.profileThumbnail(userId)}
      alt="user profile thumbnail"
      onError={({ currentTarget }) => {
        currentTarget.onerror = null
        currentTarget.src = "/img/profile/default-profile-img.svg"
      }}
    />
  </div>
)

interface ProfileInformationProps extends ProfileSocialMediaProps {
  creatorId: string
  description: string | undefined | null
  displayName: string | undefined | null
  likes: number | undefined
  numPosts: number | undefined
  onChat: () => Promise<void>
  ownsProfile: boolean
  username: string
}

export const ProfileInformationDesktop: FC<ProfileInformationProps> = ({
  creatorId,
  description,
  displayName,
  likes,
  numPosts,
  ownsProfile,
  username,
  discordUsername,
  facebookUsername,
  instagramUsername,
  tiktokUsername,
  twitchUsername,
  twitterUsername,
  youtubeUsername,
  onChat
}) => {
  const { follow, unfollow, isFollowing } = useFollow(creatorId)

  return (
    <div className="flex flex-col items-start gap-[6px]">
      <div className="grid grid-cols-2 items-center justify-around md:w-[60%] sidebar-collapse:w-full">
        <span className="text-[32px] font-medium leading-9 text-passes-white-100">
          {displayName}
        </span>
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
        {description}
      </span>
      <div className="flex w-full flex-row items-center gap-[68px]">
        <div className="flex items-center">
          <div className="flex items-center justify-center">
            <span className="mr-[6px] text-base font-medium text-passes-white-100">
              {numPosts ?? "-"}
            </span>
            <span className="text-sm font-normal text-passes-white-100/70">
              POSTS
            </span>
          </div>
          <div className="mx-[30px] h-[18px] w-[1px] bg-passes-dark-200" />
          <div className="flex items-center justify-center">
            <span className="mr-[6px] text-base font-medium text-passes-white-100">
              {compactNumberFormatter(likes || 0) ?? "-"}
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

interface EditProfileActionProps {
  onEditProfile: any
}

export const EditProfileAction: FC<EditProfileActionProps> = ({
  onEditProfile
}) => (
  <div className="absolute top-5 right-5 items-center justify-between md:top-10 md:right-0">
    <CoverButton
      className="hidden px-4 md:block"
      name="Edit profile"
      onClick={onEditProfile}
    />
    <button className="block md:hidden" onClick={onEditProfile}>
      <EditIcon />
    </button>
  </div>
)

export const ProfileInformationMobile: FC<ProfileInformationProps> = ({
  creatorId,
  description,
  displayName,
  likes,
  numPosts,
  onChat,
  ownsProfile,
  username,
  discordUsername,
  facebookUsername,
  instagramUsername,
  tiktokUsername,
  twitchUsername,
  twitterUsername,
  youtubeUsername
}) => {
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
      <ProfileStatsMobile numPosts={numPosts || 0} likes={likes || 0} />
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
