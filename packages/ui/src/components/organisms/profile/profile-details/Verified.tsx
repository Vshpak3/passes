import { FC } from "react"

interface VerifiedProps {
  isVerified: any
}

export const Verified: FC<VerifiedProps> = ({ isVerified }) => (
  <div className="align-items flex items-center justify-self-start p-4 text-passes-gray-100">
    <span className="text-[12px] font-semibold md:pl-2 md:text-sm">
      {isVerified ? "Verified" : "Not Verified"}
    </span>
  </div>
)
