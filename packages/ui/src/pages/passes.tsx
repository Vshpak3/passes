import { PassHoldingsGrid } from "src/components/molecules/pass/PassHoldingsGrid"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Passes = () => {
  return (
    <div className="mx-auto mb-[70px] grid w-full px-2 md:px-5">
      <div className="absolute top-[160px]">
        <h1 className="text-2xl font-[700]">Memberships</h1>
      </div>
      <PassHoldingsGrid />
    </div>
  )
}
export default WithNormalPageLayout(Passes)
