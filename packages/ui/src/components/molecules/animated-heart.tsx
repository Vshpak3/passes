import { motion } from "framer-motion"
import { throttle } from "lodash"
import { FC, useState } from "react"
import { Heart } from "src/icons/heart"

type AnimatedHeartProps = {
  height: number
  width: number
  pagename?: string
  alreadyLiked?: boolean
}

export const AnimatedHeart: FC<AnimatedHeartProps> = ({
  height,
  width,
  alreadyLiked
}) => {
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
          <Heart height={height} width={width} variant="filled" />
        ) : (
          <Heart height={height} width={width} />
        )}
      </motion.div>
    </div>
  )
}
