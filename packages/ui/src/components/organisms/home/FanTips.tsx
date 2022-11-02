import React from "react"

export const FanTips = () => {
  return (
    <div className="bg-[url('/img/homepage/glow.webp')] bg-contain bg-right bg-no-repeat py-32">
      <h3 className="mx-auto max-w-2xl text-center text-5xl font-extrabold leading-[4rem]">
        Fans can tip per message
        <br />
        for attention
      </h3>
      <p className="mx-auto py-4 text-center">Get paid for your time.</p>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-32 sm:px-6 lg:py-16 lg:px-8">
        <img alt="Fan Tips" className="mx-auto" src="/img/homepage/tips.svg" />
      </div>
    </div>
  )
}
