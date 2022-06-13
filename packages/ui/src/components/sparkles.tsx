import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'
import { usePrefersReducedMotion } from 'src/hooks/use-prefers-reduced-motion'
import { useRandomInterval } from 'src/hooks/use-random-interval'
import styles from 'src/styles/modules/sparkles.module.css'

const DEFAULT_COLOR = '#FFC700'

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min

const range = (start: number, end?: number, step = 1) => {
  const output = []
  const actualStart = typeof end === 'undefined' ? 0 : start
  const actualEnd = typeof end === 'undefined' ? start : end
  for (let i = actualStart; i < actualEnd; i += step) {
    output.push(i)
  }
  return output
}

const generateSparkle = (color: string) => {
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
    },
  }
  return sparkle
}

export const Sparkle = ({
  size,
  color,
  style,
}: {
  size: number
  color: string
  style: CSSProperties
}) => {
  const path =
    'M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z'

  return (
    <span className={styles['sparkle-wrapper']} style={style}>
      <svg
        className={styles['sparkle-svg']}
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

export const Sparkles = ({
  color = DEFAULT_COLOR,
  children,
  ...delegated
}: {
  color?: string
  children: ReactNode
}) => {
  const [sparkles, setSparkles] = useState(() => {
    return range(3).map(() => generateSparkle(color))
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
    prefersReducedMotion ? undefined : 50,
    prefersReducedMotion ? undefined : 450,
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
      <strong className={styles['child-wrapper']}>{children}</strong>
    </span>
  )
}
