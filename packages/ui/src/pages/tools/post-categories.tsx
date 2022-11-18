import { FC } from "react"

import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const PostCategories: FC = () => {
  usePostWebhook()

  return (
    <div className="mt-16 grid w-full grid-cols-7 lg:mt-0">
      <div className="col-span-7 border-r-[1px] border-passes-gray lg:col-span-4" />
      <div className="min-safe-h-screen sticky col-span-3 hidden max-w-[500px] flex-col lg:flex lg:px-2 lg:pr-8 xl:pl-8" />
    </div>
  )
}

export default WithNormalPageLayout(PostCategories, {
  creatorOnly: true,
  headerTitle: "Post Categories"
})
