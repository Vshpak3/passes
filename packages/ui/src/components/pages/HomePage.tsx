import { NextPage } from "next"

import { Backers } from "src/components/organisms/home/Backers"
import { ConnectWithFans } from "src/components/organisms/home/ConnectWithFans"
import { CreatorCarousel } from "src/components/organisms/home/CreatorCarousel"
import { FanTips } from "src/components/organisms/home/FanTips"
import { FAQ } from "src/components/organisms/home/FAQ"
import { Footer } from "src/components/organisms/home/Footer"
import { Hero } from "src/components/organisms/home/Hero"
import { MonthlyMemberships } from "src/components/organisms/home/MonthlyMemberships"
import { Navbar } from "src/components/organisms/home/Navbar"
import { SupportingCreators } from "src/components/organisms/home/SupportingCreators"
import { TrackStats } from "src/components/organisms/home/TrackStats"
import { IntercomWrapper } from "src/layout/IntercomWrapper"

const HomePage: NextPage = () => {
  const hidden = true
  return (
    <IntercomWrapper>
      <div className="mx-auto bg-black">
        <Navbar />
        <Hero />
        {!hidden && (
          <>
            <CreatorCarousel />
            <MonthlyMemberships />
            <ConnectWithFans />
            <TrackStats />
            <FanTips />
            <FAQ /> {/* eslint-disable-line react/jsx-pascal-case */}
            <SupportingCreators />
          </>
        )}
        <Backers />
        <Footer />
      </div>
    </IntercomWrapper>
  )
}

export default HomePage // eslint-disable-line import/no-default-export
