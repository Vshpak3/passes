import {
  GetListsRequestsDto,
  GetListsRequestsDtoOrderEnum as Order,
  GetListsRequestsDtoOrderTypeEnum as OrderType,
  GetListsResponseDto,
  ListDto,
  ListDtoTypeEnum
} from "@passes/api-client"
import { ListApi } from "@passes/api-client/apis"
import { debounce } from "lodash"
import { NextPage } from "next"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import React, { useCallback, useEffect, useMemo, useState } from "react"

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
  const [newListModalState, setNewListModalState] = useState(false)

  const [orderType, setOrderType] = useState<OrderType>(OrderType.Name)
  const [order, setOrder] = useState<Order>(Order.Asc)
  const [search, setSearch] = useState<string>("")

  const [newLists, setNewLists] = useState<ListDto[]>([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
    }, DEBOUNCE_TIMEOUT),
    [setSearch]
  )

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

  const handleCreateNewListModal = () => {
    setNewListModalState(true)
  }

  const handleCreateNewList = async (listName: string) => {
    try {
      const listId = (
        await listApi.createList({
          createListRequestDto: {
            name: listName,
            userIds: []
          }
        })
      ).listId
      setNewListModalState(false)
      setNewLists((newLists) => [
        ...newLists,
        {
          listId,
          name: listName,
          count: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          type: ListDtoTypeEnum.Normal
        }
      ])
    } catch (error) {
      errorMessage(error, true)
    }
  }

  useEffect(() => {
    setNewLists([])
  }, [fetchProps])

  const keyedComponent = useCallback(({ arg }: ComponentArg<ListDto>) => {
    return <List list={arg} removable />
  }, [])

  return (
    <div className="my-4 text-white">
      <div className="flex items-center justify-between px-4">
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
          KeyedComponent={keyedComponent}
          fetch={async (req: GetListsRequestsDto) => {
            return await listApi.getLists({ getListsRequestsDto: req })
          }}
          fetchProps={fetchProps}
          hasInitialElement={newLists.length > 0}
          keyValue="/lists"
        >
          {newLists.map((list, index) => (
            <List key={index} list={list} removable />
          ))}
        </InfiniteScrollPagination>
      </ul>
    </div>
  )
}

export default WithNormalPageLayout(FanLists, {
  creatorOnly: true,
  headerTitle: "Lists"
})
