import { PassDto } from "@passes/api-client"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { LockIcon } from "src/icons/lockIcon"

interface ProfilePassCardProps {
  pass: PassDto
}
export const ProfilePassCard = ({ pass }: ProfilePassCardProps) => {
  return (
    <div className="flex w-[218px] flex-col rounded-[20px] border border-[#2C282D] py-[17px] px-[22px]">
      <div className="aspect-[4/3] w-full rounded-[20px]">
        <PassMedia
          animationType={pass.animationType}
          passId={pass.passId}
          imageType={pass.imageType}
        />
      </div>
      <span className="text-[14px]">{pass.type}</span>
      <span className="text-[12px] text-[#ffffff43]">{pass.description}</span>
      <button className="flex flex-row items-center justify-center gap-[5px] bg-[#9C4DC1] py-[10]">
        <LockIcon /> Subscribe
      </button>
      <div className="flex flex-row">
        <span className="font-[12px] text-[#ffffff34]">{pass.price}</span>
      </div>
    </div>
  )
}
