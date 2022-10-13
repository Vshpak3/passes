import { PayoutHistory } from "src/components/organisms/payouts/PayoutHistory"
import { RequestPayouts } from "src/components/organisms/payouts/RequestPayouts"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Payouts = () => {
  return (
    <div className="-mt-[212px] flex flex-col gap-[24px] overflow-hidden bg-black p-6">
      <RequestPayouts />
      <PayoutHistory />
    </div>
  )
}
export default WithNormalPageLayout(Payouts, { creatorOnly: true })
