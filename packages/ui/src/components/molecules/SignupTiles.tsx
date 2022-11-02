import Image from "next/image"

import { GradientBorderTile } from "src/components/atoms/GradientBorderTile"
import { UserTile } from "src/components/atoms/UserTile"

export const SignupTiles = () => {
  return (
    <div className="grid grid-cols-3 gap-5 xl:gap-[25px]">
      <GradientBorderTile>
        <UserTile />
      </GradientBorderTile>
      <GradientBorderTile>
        <Image
          alt="alex drachnik card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src="/img/tiles/anna-deguzman.png"
        />
      </GradientBorderTile>
      <GradientBorderTile />

      <GradientBorderTile />
      <GradientBorderTile>
        <Image
          alt="blair-walnut card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src="/img/tiles/blair-walnut.png"
        />
      </GradientBorderTile>
      <GradientBorderTile>
        <UserTile />
      </GradientBorderTile>

      <GradientBorderTile />
      <GradientBorderTile>
        <UserTile />
      </GradientBorderTile>
      <GradientBorderTile>
        <Image
          alt="anna deguzman card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src="/img/tiles/alex-drachnik.png"
        />
      </GradientBorderTile>

      <GradientBorderTile>
        <Image
          alt="lucy palooza card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src="/img/tiles/lucy-palooza.png"
        />
      </GradientBorderTile>
      <GradientBorderTile>
        <Image
          alt="josh morris card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src="/img/tiles/josh-morris.png"
        />
      </GradientBorderTile>
      <GradientBorderTile />
    </div>
  )
}
