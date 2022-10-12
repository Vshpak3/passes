import { PassHoldingsGrid } from "src/components/molecules/pass/PassHoldingsGrid"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const Passes = () => {
  return (
    <div
      className="
       mx-auto
       mb-[70px]
       grid
       w-full
       bg-black
       px-2
       md:px-5
       sidebar-collapse:max-w-[1100px]"
    >
      <PassHoldingsGrid />
    </div>
  )
}
export default WithNormalPageLayout(Passes)
