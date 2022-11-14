import { FC } from "react"

interface LoginNFTProps {
  filename: string
}

export const LoginNFT: FC<LoginNFTProps> = ({ filename }) => {
  return (
    <video autoPlay loop muted>
      <source src={filename} type="video/webm" />
    </video>
  )
}
