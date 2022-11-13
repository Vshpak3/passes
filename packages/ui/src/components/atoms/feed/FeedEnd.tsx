import { FC } from "react"

interface FeedEndProps {
  message: string
}

export const FeedEnd: FC<FeedEndProps> = ({ message }) => (
  <div className="flex justify-center border-t-[1px] border-passes-gray p-12">
    <div className="bg-[#12070E]/50" role="alert">
      <span className="font-medium">{message}</span>
    </div>
  </div>
)
