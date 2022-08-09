import GridViewIcon from "public/icons/grid-view-icon.svg"
import ListViewIcon from "public/icons/list-view-icon.svg"
import React from "react"
import { withPageLayout } from "src/components/pages/WithPageLayout"

import { Tabs } from "../../components/molecules"
import { CreatorPassTiles } from "../../components/organisms"

const tabsArray = [
  {
    tabName: "Grid View",
    icon: <GridViewIcon />
  },
  {
    tabName: "List View",
    icon: <ListViewIcon />
  }
]
const mockData = {
  passName: "Kaila Troy Pro",
  creatorName: "Kaila Troy",
  cost: "20.00",
  imgUrl: "https://images.dog.ceo/breeds/pointer-german/n02100236_3714.jpg"
}

const Passes = () => {
  return (
    <div className="mx-auto -mt-[205px] grid grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <div className="col-span-12 w-full">
        <div className="mb-16 text-base font-medium leading-[19px]">
          <div className="my-4 flex gap-x-4">
            <span className="text-[24px] font-bold text-[#ffff]/90">
              Active subscriptions
            </span>
            <hr className="mt-2 grow border-[#2C282D]" />
            {/* List View OOS right now, currently unused */}
            <Tabs tabsArray={tabsArray} />
          </div>
          <div></div>
          <div className="flex flex-wrap gap-4">
            <CreatorPassTiles passData={mockData} />
            <CreatorPassTiles passData={mockData} />
          </div>
        </div>
        <div className="mb-16 text-base font-medium leading-[19px]">
          <div className="my-4">
            <span className="my-4 text-[24px] font-bold text-[#ffff]/90">
              Limited Edition
            </span>
            {/* <div> */}
            <div className="my-4 flex flex-wrap gap-4">
              <CreatorPassTiles passData={mockData} />
              <CreatorPassTiles passData={mockData} />
              <CreatorPassTiles passData={mockData} />
              <CreatorPassTiles passData={mockData} />
            </div>
          </div>
        </div>
        <div className="mb-16 text-base font-medium leading-[19px]">
          <span className="my-4 text-[24px] font-bold text-[#ffff]/90">
            Draft Subscription / inactive passes
          </span>
          <div className="my-4 flex flex-wrap gap-4">
            <CreatorPassTiles passData={mockData} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default withPageLayout(Passes)
