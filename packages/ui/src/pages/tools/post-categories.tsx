import { FC } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"

export const PostCategories: FC = () => {
  usePostWebhook()

  return (
    <div className="mt-16 grid w-full grid-cols-7 lg:mt-0">
      <div className="col-span-7 border-r-[1px] border-passes-gray lg:col-span-4">
        <div className="flex h-16">
          <SectionTitle className="mt-3 ml-4 pt-1 lg:mt-4">Home</SectionTitle>
        </div>
      </div>
      <div className="min-safe-h-screen sticky col-span-3 hidden max-w-[500px] flex-col lg:flex lg:px-2 lg:pr-8 xl:pl-8" />
    </div>
  )
}
