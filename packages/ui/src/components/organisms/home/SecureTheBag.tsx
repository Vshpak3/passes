import React from "react"

export const SecureTheBag = () => {
  return (
    <div className="mx-auto max-w-7xl text-clip py-32 px-4">
      <h3 className="mx-auto max-w-2xl text-center text-5xl font-extrabold leading-[4rem]">
        Secure the bag.{" "}
      </h3>
      <p className="mx-auto max-w-2xl text-center text-2xl leading-[2rem]">
        Earn recurring revenue through subscriptions, paid DMs, and other
        unlockable content.
      </p>
      <div className="mx-auto max-w-7xl text-clip px-4 sm:py-32 sm:px-6 lg:py-16 lg:px-8">
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
          alt="Connect with your fans"
          className="my-20 mx-auto flex md:hidden"
          src="/img/homepage/connect-mobile.webp"
        />
        <img
          alt="Connect with your fans"
          className="my-20 mx-auto hidden md:flex"
          src="/img/homepage/connect.webp"
        />
      </div>
    </div>
  )
}
