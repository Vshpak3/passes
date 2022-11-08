import {
  GetListsRequestsDto,
  GetListsRequestsDtoOrderEnum as Order,
  GetListsRequestsDtoOrderTypeEnum as OrderType,
  GetListsResponseDto,
  ListDto
} from "@passes/api-client"
import { ListApi } from "@passes/api-client/apis"
import { debounce } from "lodash"
import { NextPage } from "next"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import React, { useCallback, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { CreateNewListModal } from "src/components/molecules/list/CreateNewListModal"
import { List } from "src/components/organisms/creator-tools/lists/List"
import {
  SortDropdown,
  SortOption
} from "src/components/organisms/creator-tools/lists/SortDropdown"
import { errorMessage } from "src/helpers/error"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const listApi = new ListApi()

const DEBOUNCE_TIMEOUT = 500

const FanLists: NextPage = () => {
  const [resets, setResets] = useState(0)
  const [newListModalState, setNewListModalState] = useState(false)

  const [orderType, setOrderType] = useState<OrderType>(OrderType.Name)
  const [order, setOrder] = useState<Order>(Order.Asc)
  const [search, setSearch] = useState<string>("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
    }, DEBOUNCE_TIMEOUT),
    [setSearch]
  )

  const onSortSelect = async ({
    orderType,
    order
  }: SortOption<OrderType, Order>) => {
    setOrderType(orderType)
    setOrder(order || "desc")
  }

  const handleCreateNewListModal = () => {
    setNewListModalState(true)
  }

  const handleCreateNewList = async (listName: string) => {
    try {
      await listApi.createList({
        createListRequestDto: {
          name: listName,
          userIds: []
        }
      })
      await new Promise((resolve) => setTimeout(resolve, 500))
      setNewListModalState(false)
      setResets(resets + 1)
    } catch (error) {
      errorMessage(error, true)
    }
  }

  return (
    <div className="text-white">
      <div className="mt-4 flex items-center justify-between px-7">
        <h1 className="text-xl font-bold">My Lists</h1>
        <div className="relative flex items-center justify-end">
          <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
          <input
            className="block min-h-[50px] w-full appearance-none rounded-[6px] border border-[#624256] bg-transparent p-2 py-3 px-4 pl-[33px] text-sm shadow-sm placeholder:text-gray-400 read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:min-w-[296px]"
            onChange={handleChangeSearch}
            placeholder="Search list"
            type="text"
          />
          <button
            className="ml-2 block min-h-[50px] w-full appearance-none rounded-[6px] border border-[#624256] bg-transparent p-2 py-3 px-4 font-bold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:min-w-[147px]"
            onClick={handleCreateNewListModal}
          >
            + New List
          </button>
        </div>
      </div>

      <CreateNewListModal
        isOpen={newListModalState}
        onSubmit={handleCreateNewList}
        setOpen={setNewListModalState}
      />

      <ul className="px-7">
        <li className="flex items-center justify-between py-5">
          <div className="flex flex-row justify-between gap-[32px] border-b border-[#2C282D]">
            <span className="cursor-pointer border-b-[3px] border-b-[#9C4DC1] py-[16px] px-[12px] text-base font-bold">
              Created List
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
            <SortDropdown
              onSelect={onSortSelect}
              options={[
                {
                  orderType: OrderType.Name,
                  order: "asc"
                },
                {
                  orderType: OrderType.Name,
                  order: "desc"
                },
                {
                  orderType: OrderType.CreatedAt,
                  order: "asc"
                },
                {
                  orderType: OrderType.CreatedAt,
                  order: "desc"
                }
              ]}
              selection={{ orderType, order }}
            />
          </div>
        </li>
        <InfiniteScrollPagination<ListDto, GetListsResponseDto>
          KeyedComponent={({ arg }: ComponentArg<ListDto>) => {
            return <List list={arg} removable />
          }}
          fetch={async (req: GetListsRequestsDto) => {
            return await listApi.getLists({ getListsRequestsDto: req })
          }}
          fetchProps={{ order, orderType, search }}
          keyValue="/lists"
          resets={resets}
        />
      </ul>
    </div>
  )
}

export default WithNormalPageLayout(FanLists, { creatorOnly: true })
