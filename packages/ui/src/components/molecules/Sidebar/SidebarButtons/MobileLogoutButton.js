import LogoutIcon from "public/icons/sidebar-logout-icon-2.svg"
import React, { Fragment } from "react"

const MobileLogoutButton = ({ handleLogout }) => {
  return (
    <Fragment key={"sidebar-logout"}>
      <span className="group flex cursor-pointer items-center py-[15px] px-[20px] pr-0 hover:text-white">
        <a
          onClick={handleLogout}
          className="group flex cursor-pointer  items-center text-base font-semibold tracking-[0.003em] text-[#eeedef]/50 text-white group-hover:text-white"
        >
          <LogoutIcon className="mr-4  fill-[#ffffff]/50 fill-transparent group-hover:fill-[#ffffff]/80 group-hover:stroke-[#ffffff]/80" />
          Logout
        </a>
      </span>
    </Fragment>
  )
}

export default MobileLogoutButton
