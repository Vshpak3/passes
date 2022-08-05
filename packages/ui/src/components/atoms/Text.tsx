import PropTypes from "prop-types"

interface IText {
  children: React.ReactNode
  className?: string
  enableMarginBottom?: boolean
  fontSize?: number
  style?: React.CSSProperties
  tag?: keyof JSX.IntrinsicElements
}

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

const Text = ({
  children,
  className = "",
  enableMarginBottom = false,
  fontSize = 15,
  style = {},
  tag = "span"
}: IText) => {
  const Tag = tag

  return (
    <Tag
      style={{
        fontSize: `${pxToRem(fontSize)}rem`,
        letterSpacing: `${dynamicTracking(fontSize)}em`,
        lineHeight: `${dynamicLeading(fontSize)}rem`,
        marginBottom:
          enableMarginBottom || tag === "p" || tag === "pre"
            ? `${dynamicLeading(fontSize)}rem`
            : "",
        ...style
      }}
      className={"font-sans" + (className && ` ${className}`)}
    >
      {children}
    </Tag>
  )
}

Text.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  enableMarginBottom: PropTypes.bool,
  fontSize: PropTypes.number,
  style: PropTypes.object,
  tag: PropTypes.string
}

export default Text
