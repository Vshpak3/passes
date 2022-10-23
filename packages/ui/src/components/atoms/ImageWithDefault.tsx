import { FC } from "react"

type ImageProps = {
  src: string
  className?: string
  defaultColor?: string
  defaultEl?: JSX.Element
}

export const ImageWithDefault: FC<ImageProps> = ({
  src,
  className
  // defaultColor,
  // defaultEl
}) => {
  // const [hasErrored, setHasErrored] = useState(false)

  return (
    <>
      {/* {!hasErrored ? ( */}
      <img
        src={src}
        className={className}
        alt="Can't find image"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null
          // setHasErrored(true)
        }}
        width={200}
        height={200}
        style={{ objectFit: "cover" }}
      />
      {/* ) : defaultColor ? (
        <div className={`bg-${defaultColor}`} />
      ) : (
        defaultEl
      )} */}
    </>
  )
}
