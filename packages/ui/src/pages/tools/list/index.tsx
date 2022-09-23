import {
  GetListMembersResponseDto,
  GetListsRequestsDtoOrderTypeEnum,
  SearchFollowRequestDtoOrderTypeEnum
} from "@passes/api-client"
import { FollowApi, ListApi } from "@passes/api-client/apis"
import { NextPage } from "next"
import Link from "next/link"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import React, { useCallback, useEffect, useState } from "react"
import { withPageLayout } from "src/layout/WithPageLayout"

const FanLists: NextPage = () => {
  const [list, setList] = useState<Array<any>>([])
  const [, setFans] = useState<Array<any>>([])

  const fetchList = useCallback(async () => {
    const listApi = new ListApi()
    const followApi = new FollowApi()

    try {
      const allLists: any = await listApi.getLists({
        getListsRequestsDto: {
          order: "desc",
          orderType: GetListsRequestsDtoOrderTypeEnum.CreatedAt
        }
      })
      const followRes: GetListMembersResponseDto =
        await followApi.searchFollowing({
          searchFollowRequestDto: {
            order: "desc",
            orderType: SearchFollowRequestDtoOrderTypeEnum.CreatedAt
          }
        })
      setList(allLists.lists)
      setFans(followRes.listMembers)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [])

  const reverseOrder = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
    },
    []
  )

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    if (value.trim().length > 0) {
      const filteredList = list.filter((elm: any) =>
        elm.name.toLowerCase().includes(value)
      )
      setList([...filteredList])
    } else {
      fetchList()
    }
  }

  return (
    <div className="text-white">
      <div className="-mt-[160px] flex items-center justify-between px-7">
        <h1 className="text-xl font-bold">Fan List</h1>
        <header className="flex items-center justify-end">
          <span className="relative">
            <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
            <input
              type="text"
              onChange={handleChangeSearch}
              placeholder="Search fan"
              className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </span>
          <Link href="/tools/list/create">
            <button className="ml-2 block min-h-[50px] min-w-[147px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 font-bold  shadow-sm  focus:border-blue-500 focus:outline-none focus:ring-blue-500">
              + New List
            </button>
          </Link>
        </header>
      </div>

      <ul className="px-7 pt-40">
        <li className="flex items-center justify-end border-b-2 border-gray-500 px-7 py-5">
          <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
            <div className="cursor-pointer" onClick={reverseOrder}>
              <FilterIcon />
            </div>
          </div>
        </li>
        {list &&
          list.map((item: any) => (
            <Link href={`/tools/list/${item.listId}`} key={item.listId}>
              <li className="duration-400 cursor-pointer border-b-2 border-gray-500 px-7 py-5 transition-all hover:bg-white/20">
                <h1 className="text-xl font-bold">
                  {item.name || item.listId}
                </h1>
                <span className="text-base font-bold text-gray-500">
                  &nbsp; {item.count}
                </span>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  )
}

export default withPageLayout(FanLists)
