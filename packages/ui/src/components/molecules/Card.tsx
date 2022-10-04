import { FC } from "react"

interface CardProps {
  children: any
  className?: string
}

const Card: FC<CardProps> = ({ children, className = "" }) => (
  <div className={"rounded-xl" + (className && ` ${className}`)}>
    {children}
  </div>
)

export default Card
