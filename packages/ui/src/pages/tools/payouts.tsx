import {
  DefaultPayoutMethod,
  PastTransactions,
  RequestPayouts
} from "src/components/organisms"
import CreatorOnlyWrapper from "src/components/wrappers/CreatorOnly"
import { withPageLayout } from "src/layout/WithPageLayout"

const Payouts = () => {
  return (
    <CreatorOnlyWrapper isPage>
      <div className="-mt-[212px] flex flex-col gap-[24px] overflow-hidden bg-black p-6">
        <RequestPayouts />
        <DefaultPayoutMethod />
        <PastTransactions />
      </div>
    </CreatorOnlyWrapper>
  )
}
export default withPageLayout(Payouts)
