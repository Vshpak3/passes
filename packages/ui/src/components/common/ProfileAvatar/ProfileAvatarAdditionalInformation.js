import PropTypes from "prop-types"
import React from "react"

import Star from "/public/pages/profile/profile-bg-star.svg"

import { FollowButton } from "../Buttons"
import { WhiteListedCommunities } from "../WhitelistedCommunity"

const ProfileAvatarAdditionalInformation = ({
  mockCreator,
  follow,
  setFollow
}) => (
  <div className="flex-1 ">
    <h1 className="whitespace-nowrap text-4xl font-semibold uppercase text-white sm:text-3xl md:text-5xl 2xl:text-6xl ">
      <span>{mockCreator.name}</span>
    </h1>
    <h2 className="mt-2 justify-center gap-2 text-lg leading-none text-slate-300 md:justify-start lg:mt-6 xl:text-2xl">
      {mockCreator.moto}
    </h2>
    <div className="flex justify-center gap-6 pt-5 sm:justify-start sm:pt-10 xs:pt-5">
      <FollowButton
        onClick={() => setFollow(!follow)}
        value={follow}
        name={follow ? "Unfollow" : "Follow"}
      />
      {/* Temporary disabled by request */}
      {/* {follow && <WhiteButton name="Join Whitelist" />} */}
      <Star className="-ml-[52px] -mt-5" />
    </div>
    <WhiteListedCommunities />
  </div>
)

ProfileAvatarAdditionalInformation.propTypes = {
  mockCreator: PropTypes.object,
  follow: PropTypes.bool,
  setFollow: PropTypes.func
}

export default ProfileAvatarAdditionalInformation
