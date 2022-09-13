import LogoutIcon from "public/icons/sidebar-logout-icon-2.svg"
import React, { Fragment } from "react"

const LogoutButton = ({ handleLogout }) => {
  return (
    <Fragment key={"sidebar-logout"}>
      <span
        onClick={handleLogout}
        className="group flex cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
      >
        <a className="group flex cursor-pointer items-center text-gray-600 hover:text-white">
          <LogoutIcon
            aria-hidden="true"
            className="flex-shrink-0 cursor-pointer fill-[#A09FA6] hover:fill-white group-hover:fill-white"
          />
        </a>
      </span>
      <span
        onClick={handleLogout}
        className="group hidden cursor-pointer items-center py-[15px] px-[30px] sidebar-collapse:flex"
      >
        <a className="group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-[#eeedef]/50 text-white group-hover:text-white sidebar-collapse:flex">
          <LogoutIcon
            className="mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-[#ffffff]/50 stroke-2 group-hover:stroke-[#ffffff]/80"
            aria-hidden="true"
          />
          Logout
        </a>
      </span>
    </Fragment>
  )
}

export default LogoutButton
