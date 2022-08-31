import ClockIcon from "public/icons/post-alarm-clock-icon.svg"

export const Footer = () => (
  <div className="flex w-full items-center justify-end gap-[10px] p-0 pt-6">
    <span>Now</span>
    <span className="cursor-pointer rounded-full border border-[#ffffff]/10 bg-[#1b141d]/50 p-[10px]">
      <ClockIcon className="flex flex-shrink-0 " />
    </span>
    <span>
      <button className="flex w-full items-center justify-center rounded-[56px] bg-[#FFFEFF]/10 px-[18px] py-[10px] text-base font-bold text-[#ffffff]/90 ">
        Save Draft
      </button>
    </span>
    <span>
      <button className="flex w-full items-center justify-center rounded-[50px] bg-passes-pink-100 px-[30px] py-[10px] text-base font-bold text-[#ffffff]/90">
        Post
      </button>
    </span>
  </div>
)
