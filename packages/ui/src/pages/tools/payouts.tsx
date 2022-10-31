import { PayoutHistory } from "src/components/organisms/payouts/PayoutHistory"
import { RequestPayouts } from "src/components/organisms/payouts/RequestPayouts"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Payouts = () => {
  return (
    <div className="flex flex-col gap-[24px] overflow-hidden p-6">
      <RequestPayouts />
      <PayoutHistory />
    </div>
  )
}
export default WithNormalPageLayout(Payouts, { creatorOnly: true })
