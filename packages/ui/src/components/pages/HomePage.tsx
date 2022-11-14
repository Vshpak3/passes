import { NextPage } from "next"

import { Backers } from "src/components/organisms/home/Backers"
import { FanTips } from "src/components/organisms/home/FanTips"
import { Footer } from "src/components/organisms/home/Footer"
import { Hero } from "src/components/organisms/home/Hero"
import { Navbar } from "src/components/organisms/home/Navbar"
import { SecureTheBag } from "src/components/organisms/home/SecureTheBag"
import { WhatTheyWant } from "src/components/organisms/home/WhatTheyWant"
import { WorkSmarter } from "src/components/organisms/home/WorkSmarter"
import { IntercomWrapper } from "src/layout/IntercomWrapper"

const HomePage: NextPage = () => {
  return (
    <IntercomWrapper>
      <div className="mx-auto bg-black">
        <Navbar />
        <Hero />
        <WhatTheyWant />
        <SecureTheBag />
        <WorkSmarter />
        <FanTips />
        <Backers />
        <Footer />
      </div>
    </IntercomWrapper>
  )
}

export default HomePage // eslint-disable-line import/no-default-export
