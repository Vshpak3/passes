import { PayoutHistory } from "src/components/organisms/payouts/PayoutHistory"
import { RequestPayouts } from "src/components/organisms/payouts/RequestPayouts"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Payouts = () => {
  return (
    <div className="my-4 flex flex-col gap-[24px] overflow-hidden px-6">
      <RequestPayouts />
      <PayoutHistory />
    </div>
  )
}
export default WithNormalPageLayout(Payouts, {
  creatorOnly: true,
  headerTitle: "Request Payouts"
})
