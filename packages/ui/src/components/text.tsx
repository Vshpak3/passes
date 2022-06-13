import clsx from 'clsx'
import type { CSSProperties, ReactNode } from 'react'

const pxToRem = (px: number) => {
  return Number(px * 0.0625)
}

const dynamicLeading = (z: number) => {
  const l = 1.4
  return Number(pxToRem(Math.round(z * l)))
}

const dynamicTracking = (z: number) => {
  const a = -0.0223
  const b = 0.185
  const c = -0.1745
  return Number((a + b * Math.pow(Math.E, c * z)).toFixed(3))
}

export const Text = ({
  children,
  className,
  enableMarginBottom = false,
  fontSize = 15,
  style = {},
  tag = 'span',
}: {
  children: ReactNode
  className?: string
  enableMarginBottom?: boolean
  fontSize?: number
  style?: CSSProperties
  tag?: string
}) => {
  const Tag = tag as keyof JSX.IntrinsicElements

  return (
    <Tag
      style={{
        fontSize: `${pxToRem(fontSize)}rem`,
        letterSpacing: `${dynamicTracking(fontSize)}em`,
        lineHeight: `${dynamicLeading(fontSize)}rem`,
        marginBottom:
          enableMarginBottom || tag === 'p' || tag === 'pre'
            ? `${dynamicLeading(fontSize)}rem`
            : '',
        ...style,
      }}
      className={clsx('font-sans', className)}
    >
      {children}
    </Tag>
  )
}
