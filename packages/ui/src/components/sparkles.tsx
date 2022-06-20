import { CSSProperties, useState, ReactElement } from "react"
import usePrefersReducedMotion from "src/hooks/use-prefers-reduced-motion"
import useRandomInterval from "src/hooks/use-random-interval"
import styles from "src/styles/modules/sparkles.module.css"
import { range, random } from "lodash"

const DEFAULT_COLOR = "#FFC700"

const generateSparkle = (color: string) => {
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: random(0, 100) + "%",
      left: random(0, 100) + "%"
    }
  }
  return sparkle
}

interface SparklesProps {
  color: string
  children: ReactElement | ReactElement[]
  delegated: any
}
const Sparkles = ({
  color = DEFAULT_COLOR,
  children,
  ...delegated
}: SparklesProps) => {
  const [sparkles, setSparkles] = useState(() => {
    return range(0, 3).map(() => generateSparkle(color))
  })
  const prefersReducedMotion = usePrefersReducedMotion()

  useRandomInterval(
    () => {
      const sparkle = generateSparkle(color)
      const now = Date.now()
      const nextSparkles = sparkles.filter((sp) => {
        const delta = now - sp.createdAt
        return delta < 750
      })
      nextSparkles.push(sparkle)
      setSparkles(nextSparkles)
    },
    prefersReducedMotion ? null : 50,
    prefersReducedMotion ? null : 450
  )

  return (
    <span className={styles.wrapper} {...delegated}>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <strong className={styles["child-wrapper"]}>{children}</strong>
    </span>
  )
}

interface SparkleProps {
  size: string | number | undefined
  color: string | undefined
  style: CSSProperties | undefined
}
const Sparkle = ({ size, color, style }: SparkleProps) => {
  const path =
    "M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z"

  return (
    <span className={styles["sparkle-wrapper"]} style={style}>
      <svg
        className={styles["sparkle-svg"]}
        width={size}
        height={size}
        viewBox="0 0 68 68"
        fill="none"
      >
        <path d={path} fill={color} />
      </svg>
    </span>
  )
}

export default Sparkles
