import { FC } from "react"

interface PostTextContentProps {
  post: any
}

export const PostTextContent: FC<PostTextContentProps> = ({ post }) => (
  <div className="flex flex-col items-start">
    <p className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90">
      {post.text}
    </p>
    {/* {post.fundraiser && (
      <div className="ml-auto flex pt-3">
        <div className="flex cursor-pointer items-center gap-[10px] rounded-md bg-[#ffff]/10 py-[7px] px-[10px] ">
          <span className="text-[12px] font-medium leading-[22px] text-[#ffff]">
            Fundraiser
          </span>
          <span>
            <FundraiserCoinIcon />
          </span>
        </div>
      </div>
    )} */}
  </div>
)
