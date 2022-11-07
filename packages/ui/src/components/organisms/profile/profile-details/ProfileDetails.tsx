import { FollowApi } from "@passes/api-client"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Dropdown } from "src/components/organisms/profile/drop-down/Dropdown"
import { useProfile } from "src/hooks/profile/useProfile"
import { useUser } from "src/hooks/useUser"
import { EditProfile } from "./EditProfile"
import { EditProfileButton } from "./EditProfileButton"
import { ProfileImage } from "./ProfileImage"
import { ProfileImageModal } from "./ProfileImageModal"
import {
  ProfileInformationDesktop,
  ProfileInformationMobile
} from "./ProfileInformation"

const follow = new FollowApi()

export const ProfileDetails: FC = () => {
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const { user } = useUser()
  const { ownsProfile, profileUserId } = useProfile()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [profileImageOverride, setProfileImageOverride] = useState<string>()

  const chatLink = user ? `/messages?user=${profileUserId}` : "/login"

  if (!profileUserId) {
    return null
  }

  return (
    <div className="px-4">
      {isEditProfileModalOpen && (
        <EditProfile
          setEditProfileModalOpen={setIsEditProfileModalOpen}
          setProfileImageOverride={setProfileImageOverride}
        />
      )}
      <ProfileImageModal
        isProfilePicModalOpen={isProfilePicModalOpen}
        profileUserId={profileUserId}
        setIsProfilePicModalOpen={setIsProfilePicModalOpen}
      />
      <div className="relative rounded-[15px] md:flex md:gap-[40px] md:pb-10">
        {/* Desktop */}
        <div className="relative hidden grid-cols-5 md:grid">
          <ProfileImage
            onClick={() => setIsProfilePicModalOpen(true)}
            override={profileImageOverride}
            userId={profileUserId}
          />
          {ownsProfile && (
            <div className="absolute top-5 right-5 items-center justify-between md:top-10 md:right-0">
              <EditProfileButton setEditProfile={setIsEditProfileModalOpen} />
            </div>
          )}
          {!ownsProfile && user?.isCreator && (
            <div className="absolute top-5 right-5 items-center justify-between  md:right-0">
              <Dropdown
                items={[
                  {
                    text: "block",
                    handleClick: async () => {
                      try {
                        await follow.blockFollower({
                          followerId: profileUserId
                        })
                        toast.success("User Blocked Successfully")
                      } catch (error) {
                        toast.error(error as string)
                      }
                    }
                  },
                  {
                    text: "report",
                    handleClick: async () => {
                      try {
                        await follow.reportUser({
                          reportUserDto: {
                            userId: profileUserId,
                            reason: "inappropriate "
                          }
                        })
                        toast.success("User Reported Successfully")
                      } catch (error) {
                        toast.error(error as string)
                      }
                    }
                  }
                ]}
              />
            </div>
          )}
          <div className="col-span-4 flex flex-col px-5 pt-4">
            <ProfileInformationDesktop chatLink={chatLink} />
          </div>
        </div>

        {/* Mobile */}
        <div className="my-4 mt-[-220px] grid w-full content-center items-center justify-items-center gap-y-[16px] rounded-[15px] border border-[#ffffff]/10 bg-[#12070E]/50 px-[16px] py-[13px] backdrop-blur-[100px] md:hidden">
          <ProfileImage
            onClick={() => setIsProfilePicModalOpen(true)}
            userId={profileUserId}
          />
          {ownsProfile && (
            <div className="absolute top-5 right-5 items-center justify-between md:top-10 md:right-0">
              <EditProfileButton setEditProfile={setIsEditProfileModalOpen} />
            </div>
          )}
          <ProfileInformationMobile chatLink={chatLink} />
        </div>
      </div>
    </div>
  )
}
