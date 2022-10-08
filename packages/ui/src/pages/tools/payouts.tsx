import {
  DefaultPayoutMethod,
  PastTransactions,
  RequestPayouts
} from "src/components/organisms"
import { withPageLayout } from "src/layout/WithPageLayout"

const Payouts = () => {
  return (
    <div className="-mt-[212px] flex flex-col gap-[24px] overflow-hidden bg-black p-6">
      <RequestPayouts />
      <DefaultPayoutMethod />
      <PastTransactions />
    </div>
  )
}
export default withPageLayout(Payouts, { creatorOnly: true })
