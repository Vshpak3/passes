import { PassHoldings } from "src/components/molecules/pass/PassHoldings"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Passes = () => {
  return (
    <div className="mx-auto mb-[70px] w-full px-2 md:px-5">
      <PassHoldings />
    </div>
  )
}
export default WithNormalPageLayout(Passes, { headerTitle: "Memberships" })
