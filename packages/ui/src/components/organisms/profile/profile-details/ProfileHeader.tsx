import classNames from "classnames"
import { FC, useCallback, useContext, useEffect, useState } from "react"

import { ContentService } from "src/helpers/content"
import { Header } from "src/layout/Header"
import { ProfileContext } from "src/pages/[username]"

interface ProfileBannerProps {
  profileBannerOverride: string | undefined
}

export const ProfileBanner: FC<ProfileBannerProps> = ({
  profileBannerOverride
}) => {
  const { profileUserId } = useContext(ProfileContext)

  const [hasBanner, setHasBanner] = useState<boolean>(false)

  const getProfileBanner = useCallback(async () => {
    if (!profileUserId) {
      return false
    }
    const profileBanner = ContentService.profileBanner(profileUserId)
    const res = await fetch(profileBanner)
    return Math.floor(res.status / 100) === 2
  }, [profileUserId])

  useEffect(() => {
    setHasBanner(false)
    const fetch = async () => {
      setHasBanner(await getProfileBanner())
    }
    fetch()
  }, [profileUserId, getProfileBanner])

  return (
    <Header
      headerClassName={classNames("cover-image border-b-0 !h-[200px]")}
      style={
        hasBanner && !!profileUserId
          ? {
              backgroundImage: `url(${
                profileBannerOverride ||
                ContentService.profileBanner(profileUserId)
              })`
            }
          : undefined
      }
    />
  )
}
