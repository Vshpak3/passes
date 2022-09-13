import { FC } from "react"

const Skeleton: FC<{ className?: string }> = ({ className }) => (
  <div
    role="status"
    className={`animate-pulse space-y-8 md:flex md:items-center md:space-y-0 md:space-x-8 ${className}`}
  >
    <div className="mb-4 h-full w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
  </div>
)

export default Skeleton
