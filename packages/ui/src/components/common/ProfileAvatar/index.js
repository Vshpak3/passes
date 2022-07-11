import React from "react"
import Social from "src/icons/social"

const iconsDimensions = 17

const ProfileAvatar = () => (
  <div className="lg:mb-none relative mb-4 mt-7 w-fit scale-75 items-start px-4  md:mt-0 md:scale-100 md:pr-[70px] lg:mb-8">
    <div
      style={{
        boxShadow:
          " inset 0px 10.5007px 14.0009px #FFFFFF, inset -2.33348px 3.50022px 4.66696px #FFFFFF, inset -5.8337px -5.8337px 5.8337px rgba(86, 23, 80, 0.5), inset 0px -18.42px 29.472px rgba(43, 14, 68, 0.5)",
        backgroundImage: "url('/andrea-botez/avatar.jpeg')",
        backgroundSize: "cover"
      }}
      className="w mb-2 h-40 w-40  rounded-full md:h-60 md:w-60"
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        height: "3rem"
      }}
    >
      <div
        className="rounded-full p-2"
        style={{
          background: "#00000039"
        }}
      >
        <Social
          variant="Instagram"
          width={iconsDimensions}
          height={iconsDimensions}
        />
      </div>
      <div
        className="rounded-full p-2"
        style={{
          background: "#00000039"
        }}
      >
        <Social
          variant="YouTube"
          width={iconsDimensions}
          height={iconsDimensions}
        />
      </div>
      <div
        className="rounded-full p-2"
        style={{
          background: "#00000039"
        }}
      >
        <Social
          variant="Discord"
          width={iconsDimensions}
          height={iconsDimensions}
        />
      </div>
      <div
        className="rounded-full p-2"
        style={{
          background: "#00000039"
        }}
      >
        <Social
          variant="Tiktok"
          width={iconsDimensions}
          height={iconsDimensions}
        />
      </div>
    </div>
  </div>
)

export default ProfileAvatar
