import {
  GetPassesRequestDtoOrderEnum as Order,
  GetPassesRequestDtoOrderTypeEnum as OrderType
} from "@passes/api-client"
import { debounce } from "lodash"
import { NextPage } from "next"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import React, { useCallback, useMemo, useState } from "react"

import {
  SortDropdown,
  SortOption
} from "src/components/organisms/creator-tools/lists/SortDropdown"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const DEBOUNCE_TIMEOUT = 500

const PassHoldersLists: NextPage = () => {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.CreatedAt)
  const [order, setOrder] = useState<Order>(Order.Desc)
  const [search, setSearch] = useState<string>("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
    }, DEBOUNCE_TIMEOUT),
    [setSearch]
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchProps = useMemo(() => {
    return {
      order,
      orderType,
      search
    }
  }, [order, orderType, search])

  const onSortSelect = async ({
    orderType,
    order
  }: SortOption<OrderType, Order>) => {
    setOrderType(orderType)
    setOrder(order || "desc")
  }

  // const keyedComponent = useCallback(({ arg }: ComponentArg<ListDto>) => {
  //   return <ListCached list={arg} removable />
  // }, [])

  return (
    <div className="my-4 text-white">
      <div className="flex items-center justify-between px-4">
        <div className="relative flex items-center justify-end">
          <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
          <input
            className="block min-h-[50px] w-full appearance-none rounded-[6px] bg-transparent p-2 py-3 px-4 pl-[33px] text-sm shadow-sm placeholder:text-gray-400 read-only:pointer-events-none read-only:bg-gray-200 focus:border-passes-pink-100/80 focus:outline-none focus:ring-passes-pink-100/80 sm:min-w-[296px]"
            onChange={handleChangeSearch}
            placeholder="Search passes"
            type="text"
          />
        </div>
      </div>

      <ul className="px-7">
        <li className="flex items-center justify-between py-5">
          <div className="flex flex-row justify-between gap-[32px] border-b border-[#2C282D]">
            <span className="cursor-pointer border-b-[3px] border-b-passes-pink-100 py-[16px] px-[12px] text-base font-bold">
              Created List
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
            <SortDropdown
              onSelect={onSortSelect}
              options={[
                {
                  orderType: OrderType.CreatedAt,
                  order: "desc"
                },
                {
                  orderType: OrderType.Price,
                  order: "desc"
                },
                {
                  orderType: OrderType.CreatedAt,
                  order: "asc"
                },
                {
                  orderType: OrderType.Price,
                  order: "desc"
                }
              ]}
              selection={{ orderType, order }}
            />
          </div>
        </li>
      </ul>
    </div>
  )
}

export default WithNormalPageLayout(PassHoldersLists, {
  creatorOnly: true,
  headerTitle: "Pass Holder Lists"
})
