import React from "react"

export const MonthlyMemberships = () => {
  return (
    <div className="mx-auto max-w-7xl py-32 px-4 lg:py-48" id="features">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
        <img
          alt="Connect with your fans"
          className="order-2 col-span-3 mx-auto w-full max-w-3xl lg:order-1"
          src="/img/homepage/memberships.webp"
        />
        <div className="order-1 col-span-2 max-w-lg space-y-4 lg:order-2">
          <span
            className="rounded-full px-4 py-2"
            style={{
              backgroundImage:
                "linear-gradient(88deg, #f2bd6c, #bd499b 65%, #a359d5)"
            }}
          >
            Passes
          </span>
          <h3 className="max-w-2xl text-4xl font-extrabold leading-[4rem] md:text-5xl">
            Monthly memberships for your biggest fans
          </h3>
          <p className="max-w-sm py-4">
            Earn a recurring income by accepting monthly subscriptions for
            exclusive behind-the-scenes content that your fans will love.
          </p>
        </div>
      </div>
    </div>
  )
}
