import PassesLogo from "public/icons/passes-logo.svg"

const Hero = () => {
  return (
    <header className="relative z-10 px-5 pt-[60px] md:px-[135px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <PassesLogo />
          <span className="text-[21px] font-bold leading-[22px]">Passes</span>
        </div>
      </div>

      <div className="mt-10 md:mt-[158px]">
        <h2 className="font-prompt text-5xl md:text-8xl md:leading-[88px]">
          Lucypalooza
        </h2>

        <div className="text-label-lg md:text-label-xl">
          <p className="mt-4 text-passes-pink-50 md:mt-[52px]">
            Wednesday, Oct 12
          </p>
          <p className="mt-1 md:mt-0">Los Angeles, CA</p>
        </div>

        <p className="mt-80 max-w-[427px] text-[17px] leading-[22px] md:mt-9">
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
