import LogoutIcon from "public/icons/sidebar-logout-icon-2.svg"
import { FC, Fragment } from "react"

interface MobileLogoutButtonProps {
  handleLogout: any
}

const MobileLogoutButton: FC<MobileLogoutButtonProps> = ({ handleLogout }) => {
  return (
    <Fragment key={"sidebar-logout"}>
      <span className="group flex cursor-pointer items-center py-[15px] px-[20px] pr-0 hover:text-white">
        <a
          onClick={handleLogout}
          className="group flex cursor-pointer items-center pl-[3px] text-base font-semibold tracking-[0.003em] text-[#eeedef]/50 text-white group-hover:text-white"
        >
          <LogoutIcon
            className="mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-[#ffffff]/50 stroke-2 group-hover:stroke-[#ffffff]/80"
            aria-hidden="true"
          />
          Logout
        </a>
      </span>
    </Fragment>
  )
}

export default MobileLogoutButton
