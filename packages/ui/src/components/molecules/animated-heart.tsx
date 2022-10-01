import { motion } from "framer-motion"
import { throttle } from "lodash"
import { useState } from "react"
import HeartIcon from "src/icons/heart"

type Props = {
  height: number
  width: number
  pagename?: string
  alreadyLiked?: boolean
}

const AnimatedHeart = ({ height, width, alreadyLiked }: Props) => {
  const [liked, setLiked] = useState(alreadyLiked)

  const handleLike = throttle(async (event: any) => {
    const nowLiked = !liked
    setLiked(nowLiked)

    event.stopPropagation()
  }, 500)

  return (
    <div>
      <motion.div
        onClick={handleLike}
        style={{ height: height + 24, width: width + 24 }}
        className="grid cursor-pointer place-items-center"
        whileTap={{ scale: 3 }}
        transition={{ duration: 0.25 }}
      >
        {liked ? (
          <HeartIcon height={height} width={width} variant="filled" />
        ) : (
          <HeartIcon height={height} width={width} />
        )}
      </motion.div>
    </div>
  )
}

export default AnimatedHeart
