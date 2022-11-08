import { PassHoldings } from "src/components/molecules/pass/PassHoldings"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Passes = () => {
  return (
    <div className="mx-auto mb-[70px] w-full px-2 md:px-5">
      <div className="absolute top-[160px]">
        <h1 className="text-2xl font-[700]">My Memberships</h1>
      </div>
      <PassHoldings />
    </div>
  )
}
export default WithNormalPageLayout(Passes)
