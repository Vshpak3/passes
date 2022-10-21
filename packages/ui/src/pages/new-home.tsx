import { NextPage } from "next"
import React from "react"
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

const Home: NextPage = () => {
  return (
    <div className="mx-auto">
      <Navbar />
      <Hero />
      <CreatorCarousel />
      <MonthlyMemberships />
      <ConnectWithFans />
      <TrackStats />
      <FanTips />
      <FAQ />
      <SupportingCreators />
      <Backers />
      <Footer />
    </div>
  )
}

export default Home
