import React from "react"

export const TrackStats = () => {
  return (
    <div className="mx-auto max-w-7xl text-clip py-32 px-4">
      <h3 className="mx-auto max-w-2xl text-center text-5xl font-extrabold leading-[4rem]">
        Track your stats & grow your following
      </h3>
      <p className="mx-auto py-4 text-center">
        Track your monthly income, subscriber count, and more.
      </p>
      <div className="mx-auto max-w-7xl text-clip px-4 sm:py-32 sm:px-6 lg:py-16 lg:px-8">
        <img
          alt="Track Stats"
          className="my-20 mx-auto"
          src="/img/homepage/stats.webp"
        />
      </div>
    </div>
  )
}
