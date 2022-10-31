import React from "react"

export const ConnectWithFans = () => {
  return (
    <div className="mx-auto max-w-7xl overflow-clip py-32 px-4">
      <h3 className="mx-auto max-w-2xl text-center text-5xl font-extrabold leading-[4rem]">
        Connect with your fans and get paid doing it
      </h3>
      <p className="mx-auto py-4 text-center">
        Set your own pay-per-message price and earn tips on posts.
      </p>
      <div className="mx-auto max-w-7xl overflow-clip px-4 sm:py-32 sm:px-6 lg:py-16 lg:px-8">
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle closest-corner at 50% 50%, #f2bd6c, #bd499b 69%, #a359d5 101%)",
            position: "absolute",
            left: "0%",
            top: "auto",
            right: "0%",
            bottom: "auto",
            zIndex: -1,
            width: "min(50vh, 95vw)",
            height: "min(50vh, 95vw)",
            margin: "auto",
            borderRadius: "50%",
            opacity: 0.6,
            WebkitFilter: "blur(60px)",
            filter: "blur(60px)"
          }}
        />
        <img
          className="my-20 mx-auto flex md:hidden"
          src="/img/homepage/connect-mobile.webp"
          alt="Connect with your fans"
        />
        <img
          className="my-20 mx-auto hidden md:flex"
          src="/img/homepage/connect.webp"
          alt="Connect with your fans"
        />
      </div>
    </div>
  )
}
