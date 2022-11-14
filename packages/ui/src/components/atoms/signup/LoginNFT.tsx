import classNames from "classnames"
import { FC } from "react"

interface LoginNFTProps {
  filename: string
  hidden: boolean
  setLoaded: () => void
}

export const LoginNFT: FC<LoginNFTProps> = ({
  filename,
  hidden,
  setLoaded
}) => {
  return (
    <video
      autoPlay
      className={classNames("rounded-[15px]", { hidden })}
      loop
      muted
      onLoadedData={setLoaded}
    >
      <source src={filename} type="video/webm" />
    </video>
  )
}
