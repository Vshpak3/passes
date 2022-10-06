import PassesLogo from "public/icons/passes-logo.svg"

const Hero = () => {
  return (
    <header className="relative z-10 px-[135px] pt-[60px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <PassesLogo />
          <span className="text-[21px] font-bold leading-[22px]">Passes</span>
        </div>

        <nav>
          <ul className="flex items-center space-x-[58px] text-base font-semibold leading-[22px]">
            {/**<li>
              <a href="#">Preview</a>
            </li>
            <li>
              <a href="#">Features</a>
            </li>
            <li>
              <a href="#">Sign in</a>
            </li>
            <li>
              <Button
                tag="button"
                variant="white"
                className="text-label !px-[23px] !py-[13px] text-[#070307]"
              >
                Sign up
              </Button>
            </li> */}
          </ul>
        </nav>
      </div>

      <div className="mt-[158px]">
        <h2 className="font-prompt text-8xl leading-[88px]">Lucypalooza</h2>

        <div className="text-label-xl">
          <p className="mt-[52px] text-passes-pink-50">Wednesday, Oct 12</p>
          <p>Los Angeles, CA</p>
        </div>

        <p className="mt-9 max-w-[427px] text-[17px] leading-[22px]">
          Join us for the Launch party of Passes.com, a new web3 social media
          platform aimed to empower creators. Artists, influencers, celebrities,
          magicians and most well-known content creators will be in attendance.
          Open bar (alcohol for 21+), food, music, networking and more will be
          featured.
        </p>
      </div>
    </header>
  )
}

export default Hero
