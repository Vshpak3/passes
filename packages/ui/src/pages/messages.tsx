import { MessagesV2 } from "src/components/organisms"
import { withPageLayout } from "src/layout/WithPageLayout"

const Messages2 = () => (
  <div className="flex h-screen flex-col">
    <div className="mt-8 ml-5 mb-3 font-bold text-[#ffffff] md:text-[20px] md:leading-[25px]">
      Messages
    </div>
    <MessagesV2 />
  </div>
)

export default withPageLayout(Messages2, { header: false })
