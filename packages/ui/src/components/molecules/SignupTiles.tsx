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
          src="/img/tiles/anna-deguzman.png"
          alt="alex drachnik card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </GradientBorderTile>
      <GradientBorderTile />

      <GradientBorderTile />
      <GradientBorderTile>
        <Image
          src="/img/tiles/blair-walnut.png"
          alt="blair-walnut card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
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
          src="/img/tiles/alex-drachnik.png"
          alt="anna deguzman card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </GradientBorderTile>

      <GradientBorderTile>
        <Image
          src="/img/tiles/lucy-palooza.png"
          alt="lucy palooza card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </GradientBorderTile>
      <GradientBorderTile>
        <Image
          src="/img/tiles/josh-morris.png"
          alt="josh morris card"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </GradientBorderTile>
      <GradientBorderTile />
    </div>
  )
}
