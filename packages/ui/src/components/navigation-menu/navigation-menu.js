import Link from "next/link"
import MomentLogo from "public/moment-logo.svg"

const NavigationMenu = () => {
  return (
    <ul
      id="navigationMenu"
      className="menu fixed flex h-full w-60 items-center text-white"
    >
      <li className="mb-7 flex w-full items-center justify-center py-7">
        <Link href="/Users/mateo/Desktop/lazer/monorepo/packages/ui/src/pages">
          <div>
            <MomentLogo />
          </div>
        </Link>
      </li>
      <li className="py5 mb-7 px-6">
        <Link href="/Users/mateo/Desktop/lazer/monorepo/packages/ui/src/pages">
          <div>Home</div>
        </Link>
      </li>
      <li className="py5 mb-7 px-6">
        <a>Passes</a>
      </li>
      <li className="py5 mb-7 px-6">
        <a>Payments</a>
      </li>
      <li className="py5 mb-7 px-6">
        <a>Suscriptions</a>
      </li>
      <li className="py5 mb-7 px-6">
        <a>Settings</a>
      </li>
    </ul>
  )
}

export default NavigationMenu
