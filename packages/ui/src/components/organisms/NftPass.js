import Image from "next/image"
import PropTypes from "prop-types"
import Tilt from "react-parallax-tilt"
import { Text } from "src/components/atoms"
import { Avatar } from "src/components/molecules"

const NFTPass = ({ avatarUrl, passUrl, number }) => {
  return (
    <Tilt
      style={{
        clipPath: "polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% 38%)",
        transformStyle: "preserve-3d"
      }}
      className="relative flex h-[450px] min-w-[320px] max-w-[82%] justify-center bg-white/40 pt-24 backdrop-blur-2xl dark:bg-black/40"
      tiltAngleYInitial={15}
      tiltAngleXInitial={-10}
      tiltMaxAngleX={16}
      tiltMaxAngleY={-11}
      transitionSpeed={1500}
      scale={1.01}
      glareEnable={true}
      glareColor="#ffffff"
    >
      <div>
        <div className="absolute right-4 top-4 rounded-full bg-purple-purple2 dark:bg-purpleDark-purple2">
          <Avatar
            className="!h-12 !w-12 mix-blend-luminosity"
            src={avatarUrl}
          />
        </div>
        <div className="rounded-full border border-mauve-mauve6 p-8 dark:border-mauveDark-mauve6">
          <Image className="h-48 w-48" src={passUrl} alt="" />
        </div>
        <Text className="absolute bottom-6 right-8 font-semibold" fontSize={48}>
          #{number}
        </Text>
      </div>
    </Tilt>
  )
}

NFTPass.propTypes = {
  avatarUrl: PropTypes.string,
  passUrl: PropTypes.string,
  number: PropTypes.number
}

export default NFTPass
