import { useCreatePost } from "src/hooks"

export const Footer = () => {
  const { scheduledPostTime } = useCreatePost()

  return (
    <div className="flex w-full items-center justify-end gap-[10px] p-0 pt-6">
      <span>
        <button className="flex w-full items-center justify-center rounded-[50px] bg-passes-pink-100 px-[30px] py-[10px] text-base font-bold text-[#ffffff]/90">
          {scheduledPostTime ? "Schedule Post" : "Post"}
        </button>
      </span>
    </div>
  )
}
