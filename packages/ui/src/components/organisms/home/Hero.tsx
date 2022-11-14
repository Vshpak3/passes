export const Hero = () => {
  return (
    <div className="bg-[url('/img/homepage/hero-bkg.webp')] bg-cover bg-no-repeat">
      <div className="mx-auto max-w-7xl text-clip px-4 py-24">
        <div className="flex flex-col items-center space-y-8">
          <h3 className="mx-auto max-w-lg text-center text-5xl font-extrabold leading-[3.5rem]">
            Exclusive Content from creators to fans
          </h3>
          <img
            alt="Palooza"
            className="my-20 mx-auto"
            src="/img/homepage/palooza.gif"
          />
          <a href="https://jobs.lever.co/Passes">
            <span
              className="mx-auto cursor-pointer rounded-full px-4 py-2"
              style={{
                backgroundImage:
                  "linear-gradient(88deg, #f2bd6c, #bd499b 65%, #a359d5)"
              }}
            >
              We&apos;re hiring! See open positions
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
