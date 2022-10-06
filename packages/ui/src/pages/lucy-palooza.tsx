import { Suspense } from "react"
import Faq from "src/components/molecules/lucypalooza/Faq"
import Hero from "src/components/organisms/lucypalooza/Hero"
import Passes from "src/components/organisms/lucypalooza/Passes"

const LucyPalooza = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-black">
      <div className="relative mx-auto max-w-[1440px] pb-[94px]">
        <div className="absolute right-0 top-0 h-[894px] w-[856px]">
          <img
            src="/img/lucyplooza/hero.jpg"
            alt=""
            className="h-full w-full"
          />
          {/* right blur ellipse */}
          <span className="absolute top-0 right-[-391px] z-10 h-[555px] w-[555px] rounded-full bg-[#351544] blur-[150px]"></span>

          {/* left blur ellipse */}
          <span className="absolute top-[208px] left-[-168px] z-10 h-[411px] w-[411px] rounded-full bg-[#441536] blur-[100px]"></span>

          <img
            src="/img/lucyplooza/vertical-text-outline.png"
            alt=""
            className="absolute left-3.5 top-0 z-10"
          />
        </div>

        <Hero />
        <Suspense fallback={`Loading...`}>
          <Passes />
        </Suspense>
        <Faq />

        <section className="mt-[226px]">
          <h3 className="text-center text-2xl font-bold leading-9">
            Contact Us
          </h3>
        </section>

        <footer className="mt-[398px] text-center">
          <h6 className="font-bold leading-[22px]">
            Building in 🗽 NYC + 🌴 Miami.
          </h6>
          <p className="mt-[9px] leading-[22px] text-white/50">
            © Moment HQ Inc. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default LucyPalooza
