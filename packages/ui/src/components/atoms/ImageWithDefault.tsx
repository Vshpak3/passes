import { FC, useState } from "react"

type ImageProps = {
  src: string
  className?: string
  defaultColor?: string
  defaultEl?: JSX.Element
}

export const ImageWithDefault: FC<ImageProps> = ({
  src,
  className,
  defaultColor,
  defaultEl
}) => {
  const [hasErrored, setHasErrored] = useState(false)

  return (
    <>
      {!hasErrored ? (
        <img
          src={src}
          className={className}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            setHasErrored(true)
          }}
        />
      ) : defaultColor ? (
        <div className={`bg-${defaultColor}`} />
      ) : (
        defaultEl
      )}
    </>
  )
}
