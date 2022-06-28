import Link from "next/link"
import MomentLogo from "public/moment-logo.svg"
import SmallMomentLogo from "public/small-moment-logo.svg"
import HomeIcon from "public/icons/home.svg"
import MessagesIcon from "public/icons/messages.svg"
import PassesIcon from "public/icons/passes.svg"
import SubscriptionsIcon from "public/icons/subscriptions.svg"
import SettingsIcon from "public/icons/settings.svg"

const NavigationMenu = () => {
  return (
    <ul
      id="navigationMenu"
      className="md:w-18 menu fixed flex h-20 w-full flex-row items-center text-white sm:h-full sm:w-12 sm:w-24 sm:flex-col lg:w-1/5 2xl:w-1/4"
    >
      <li className="ml-6 flex w-full items-start justify-center sm:m-0 sm:mb-7 sm:items-center sm:py-7">
        <Link href="/Users/mateo/Desktop/lazer/monorepo/packages/ui/src/pages">
          <>
            <div className="hidden lg:block">
              <MomentLogo />
            </div>
            <div className="sm:visible lg:hidden">
              <SmallMomentLogo />
            </div>
          </>
        </Link>
      </li>
      <div className="hidden sm:block">
        <li className="py5 mb-7 px-4">
          <Link href="/">
            <div>
              <HomeIcon />
              <span className="hidden lg:inline-block">Home</span>
            </div>
          </Link>
        </li>
        <li className="py5 mb-7 px-4">
          <Link href="/">
            <div>
              <MessagesIcon />
              <span className="hidden lg:inline-block">Passes</span>
            </div>
          </Link>
        </li>
        <li className="py5 mb-7 px-4">
          <Link href="/">
            <div>
              <PassesIcon />
              <span className="hidden lg:inline-block">Payments</span>
            </div>
          </Link>
        </li>
        <li className="py5 mb-7 px-4">
          <Link href="/">
            <div>
              <SubscriptionsIcon />
              <span className="hidden lg:inline-block">Suscriptions</span>
            </div>
          </Link>
        </li>
        <li className="py5 mb-7 px-4">
          <Link href="/">
            <div>
              <SettingsIcon />
              <span className="hidden lg:inline-block">Suscriptions</span>
            </div>
          </Link>
        </li>
      </div>
    </ul>
  )
}

export default NavigationMenu
