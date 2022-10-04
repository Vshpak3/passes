import { CreatorEarningDto } from "@passes/api-client"
import MediaPhoto from "public/icons/media-photos.svg"
import React, { FC, useState } from "react"
import { getFormattedDate } from "src/helpers"

import Filter from "./Filter"
import { Filters } from "./types"

interface ITableProps {
  graphData: CreatorEarningDto[]
}

const Table: FC<ITableProps> = ({ graphData }) => {
  const [activeFilter, setActiveFilter] = useState(Filters["most-recent"])

  return (
    <>
      {graphData?.length === 0 && (
        <p className="text-label mt-8 text-center text-passes-gray-200 lg:mt-[47px]">
          No activity during selected period.
        </p>
      )}

      {graphData.length > 0 && (
        <>
          <Filter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <div className="w-full overflow-auto">
            <table className="mt-5 w-full whitespace-nowrap lg:mt-6">
              <thead>
                <tr className="text-passes-gray-200">
                  <th className="pr-4 pb-1 text-start text-base font-medium md:pr-2 lg:pr-1">
                    Date & Time
                  </th>
                  <th className="px-4 pb-1 text-start text-base font-medium md:px-2 lg:px-1">
                    Post text
                  </th>
                  <th className="px-4 pb-1 text-base font-medium md:px-2 lg:px-1">
                    Attachment
                  </th>
                  <th className="px-4 pb-1 text-base font-medium md:px-2 lg:px-1">
                    Price
                  </th>
                  <th className="px-4 pb-1 text-base font-medium md:px-2 lg:px-1">
                    Reached
                  </th>
                  <th className="px-4 pb-1 text-base font-medium md:px-2 lg:px-1">
                    Purchased
                  </th>
                  <th className="px-4 pb-1 text-base font-medium md:px-2 lg:px-1">
                    Earned
                  </th>
                  <th className="pl-4 pb-1 text-base font-medium md:pl-2 lg:pl-1">
                    Delete Post
                  </th>
                </tr>
              </thead>
              <tbody className="text-label text-center">
                {graphData.map((data, i) => (
                  <tr key={i} className="border-b border-passes-dark-200">
                    <td className="py-3 pr-4 text-start md:pr-2 lg:pr-1">
                      {getFormattedDate(data.createdAt)}
                    </td>
                    <td className="md:px-auto px-4 py-3 text-start md:px-2 lg:px-1">
                      Here, first line or first # of letters of the post
                    </td>
                    <td className="flex items-center justify-center space-x-3 px-4 py-3 md:px-2 lg:px-1">
                      <MediaPhoto />
                      <span>1</span>
                    </td>
                    <td className="px-4 py-3 md:px-2 lg:px-1">
                      ${data.amount}
                    </td>
                    <td className="px-4 py-3 md:px-2 lg:px-1">12054</td>
                    <td className="px-4 py-3 md:px-2 lg:px-1">609</td>
                    <td className="px-4 py-3 md:px-2 lg:px-1">$3045.00</td>
                    <td className="py-3 pl-4 md:pl-2 lg:pl-1">
                      <button className="text-passes-pink-100" type="button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {/* <tr className="border-b border-passes-dark-200">
                  <td className="py-3 pr-4 text-start md:pr-2 lg:pr-1">
                    Aug 29, 2022 5:53pm
                  </td>
                  <td className="px-4 py-3 text-start md:px-2 lg:px-1">
                    Here, first line or first # of letters of the post
                  </td>
                  <td className="flex items-center justify-center space-x-3 px-4 py-3 md:px-2 lg:px-1">
                    <MediaRecorder />
                    <span>1</span>
                  </td>
                  <td className="px-4 py-3 md:px-2 lg:px-1">$5.00</td>
                  <td className="px-4 py-3 md:px-2 lg:px-1">12054</td>
                  <td className="px-4 py-3 md:px-2 lg:px-1">609</td>
                  <td className="px-4 py-3 md:px-2 lg:px-1">$3045.00</td>
                  <td className="py-3 pl-4 md:pl-2 lg:pl-1">
                    <button className="text-passes-pink-100" type="button">
                      Delete
                    </button>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

export default Table
