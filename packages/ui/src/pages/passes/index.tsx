// import { Tabs } from "src/components/molecules"
// import GridViewIcon from "public/icons/grid-view-icon.svg"
// import ListViewIcon from "public/icons/list-view-icon.svg"
import React from "react"
import { CreatorPassTiles } from "src/components/organisms"
import { usePasses } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const Passes = () => {
  const { fanPasses } = usePasses()
  const subscriptionPasses = fanPasses?.filter((pass) => {
    return pass.type === "subscription"
  })
  const lifetimePasses = fanPasses?.filter((pass) => {
    return pass.type === "lifetime"
  })

  return (
    <div className="mx-auto -mt-[160px] grid grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <div className="col-span-12 w-full">
        <div className="mb-16 text-base font-medium leading-[19px]">
          <div className="my-4 flex gap-x-4">
            <span className="text-[24px] font-bold text-[#ffff]/90">
              Active subscriptions
            </span>
            <hr className="mt-2 grow border-passes-dark-200" />
            {/* List View OOS right now, currently unused */}
            {/* <Tabs tabsArray={tabsArray} /> */}
          </div>
          <div className="flex flex-wrap gap-4">
            {subscriptionPasses?.map((pass) => {
              return (
                <>
                  <CreatorPassTiles passData={pass} />
                </>
              )
            })}
          </div>
        </div>
        <div className="mb-16 text-base font-medium leading-[19px]">
          <div className="my-4">
            <span className="my-4 text-[24px] font-bold text-[#ffff]/90">
              Lifetime Pass
            </span>
            <div className="my-4 flex flex-wrap gap-4">
              {lifetimePasses?.map((pass) => {
                return (
                  <>
                    <CreatorPassTiles passData={pass} />
                  </>
                )
              })}
            </div>
          </div>
        </div>
        <div className="mb-16 text-base font-medium leading-[19px]">
          <span className="my-4 text-[24px] font-bold text-[#ffff]/90">
            Archived Passes
          </span>
          <div className="my-4 flex flex-wrap gap-4">
            {/* {inactive passes goes here} */}
          </div>
        </div>
      </div>
    </div>
  )
}
export default withPageLayout(Passes)
