import { useRouter } from "next/router"
import { Suspense, useEffect } from "react"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { Faq } from "src/components/molecules/lucypalooza/Faq"
import { Hero } from "src/components/organisms/lucypalooza/LucypaloozaHero"
import { Passes } from "src/components/organisms/lucypalooza/LucypaloozaPasses"
import { useUser } from "src/hooks/useUser"

const LucyPalooza = () => {
  const { user, loading } = useUser()
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

  return (
    <div className="min-h-screen overflow-hidden bg-black">
      <div className="relative mx-auto max-w-[1440px] pb-[94px]">
        <div className="absolute top-60 right-0 h-[894px] md:top-0 md:w-[856px]">
          {/* <img src="/img/lucyplooza/hero.jpg" alt="" className="w-full" /> */}
          {/* right blur ellipse */}
          <span className="absolute top-0 right-[-391px] z-10 h-[555px] w-[555px] rounded-full bg-[#351544] blur-[150px]"></span>

          {/* left blur ellipse */}
          <span className="absolute top-[208px] left-[-168px] z-10 h-[411px] w-[411px] rounded-full bg-[#441536] blur-[100px]"></span>

          <img
            src="/img/lucyplooza/vertical-text-outline.png"
            alt=""
            className="absolute -top-80 right-3 z-10 md:right-auto md:top-0 md:left-3.5"
          />
        </div>

        <Hero />
        <ConditionRendering condition={!!user}>
          <Suspense fallback={`Loading...`}>
            <Passes />
          </Suspense>
        </ConditionRendering>
        <Faq />

        <section className="mt-[226px] text-center">
          <h3 className="text-center text-2xl font-bold leading-9">
            Contact Us
          </h3>
          <a
            href="mailto:support@passes.com"
            target="_blank"
            className="text-center text-sm leading-9"
            rel="noreferrer"
          >
            support@passes.com
          </a>
        </section>

        <footer className="mt-[398px] text-center">
          <h6 className="font-bold leading-[22px]">
            Building in 🗽 NYC + 🌴 Miami.
          </h6>
          <p className="mt-[9px] leading-[22px] text-white/50">
            © Passes Inc. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default LucyPalooza // no WithNormalPageLayout
