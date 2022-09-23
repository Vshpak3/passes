import Image from "next/image"
import ChatIcon from "public/icons/chat.svg"
import ChevronDown from "public/icons/chevron-down-icon.svg"
import CreatorSearchBar from "src/layout/CreatorSearchBar"

const Header = () => {
  return (
    <div className="cover-image flex-shrink-0 px-5 pt-16 md:h-[88px] md:pt-[17px] sidebar-collapse:pr-14">
      <div className="flex gap-x-6 py-4 md:py-0 sidebar-collapse:justify-end">
        <div className="hidden md:block">
          <CreatorSearchBar />
        </div>
        <button className="flex items-center space-x-2.5 rounded-md bg-[#1b141d]/50 px-5 font-medium">
          <ChatIcon />
          <span>Chat</span>
        </button>
        <button className="flex items-center space-x-3">
          <div className="relative h-[34px] w-[34px]">
            <Image
              layout="fill"
              src="/img/user.png"
              alt="user profile img"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <ChevronDown />
        </button>
      </div>
    </div>
  )
}

export default Header
