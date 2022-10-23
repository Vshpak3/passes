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
       "
    >
      <div className="absolute top-[160px]">
        <h1 className="text-2xl font-[700]">My passes</h1>
        <div className="text-l mt-[50px] flex flex-row items-center gap-[4px] font-[700]">
          {/* <p>Pass</p> <ChevronRight size={24} /> <p>All</p> */}
        </div>
      </div>
      <PassHoldingsGrid />
    </div>
  )
}
export default WithNormalPageLayout(Passes)
