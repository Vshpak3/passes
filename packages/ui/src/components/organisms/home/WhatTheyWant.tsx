import React from "react"

export const WhatTheyWant = () => {
  return (
    <div className="mx-auto max-w-7xl py-32 px-4 lg:py-48" id="features">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
        <img
          alt="Connect with your fans"
          className="order-2 col-span-3 mx-auto w-full max-w-3xl lg:order-1"
          src="/img/homepage/memberships.webp"
        />
        <div className="order-1 col-span-2 max-w-lg space-y-4 lg:order-2">
          <h3 className="max-w-2xl text-4xl font-extrabold leading-[4rem] md:text-5xl">
            Give the people what they want.{" "}
          </h3>
          <p className="max-w-sm py-4">
            TikTok is oversaturated. Instagram wants to be TikTok. Give your
            superfans the quality content they deserve.{" "}
          </p>
        </div>
      </div>
    </div>
  )
}
