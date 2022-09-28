import { Fade } from "@mui/material"
import Popper from "@mui/material/Popper"
import {
  GetListMembersResponseDto,
  GetListsRequestsDtoOrderEnum,
  GetListsRequestsDtoOrderTypeEnum,
  SearchFollowRequestDtoOrderTypeEnum
} from "@passes/api-client"
import { FollowApi, ListApi } from "@passes/api-client/apis"
import { debounce } from "lodash"
import { NextPage } from "next"
import Link from "next/link"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import React, { useCallback, useEffect, useState } from "react"
import SortListPopup from "src/components/pages/tools/lists/SortListPopup"
import { withPageLayout } from "src/layout/WithPageLayout"

const listApi = new ListApi()
const followApi = new FollowApi()

const FanLists: NextPage = () => {
  const [list, setList] = useState<Array<any>>([])
  const [, setFans] = useState<Array<any>>([])
  const [orderType, setOrderType] = useState<GetListsRequestsDtoOrderTypeEnum>(
    GetListsRequestsDtoOrderTypeEnum.Name
  )
  const [orderDirection, setOrderDirection] =
    useState<GetListsRequestsDtoOrderEnum>(GetListsRequestsDtoOrderEnum.Asc)
  const [lastId, setLastId] = useState<string>("")
  const [keyword, setKeyword] = useState<string>("")
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [anchorSortPopperEl, setAnchorSortPopperEl] =
    useState<null | HTMLElement>(null)

  const fetchList = useCallback(
    async (
      keywordSearch = "",
      orderTypeInput?: GetListsRequestsDtoOrderTypeEnum,
      orderDirectionInput?: GetListsRequestsDtoOrderEnum,
      isUpdate = false
    ) => {
      const requestDto = {
        order: orderDirectionInput ? orderDirectionInput : orderDirection,
        orderType: orderTypeInput ? orderTypeInput : orderType
      }

      // only call api when no any request is calling
      if (!isLoadingMore) {
        try {
          const allLists: any = await listApi.getLists({
            getListsRequestsDto: Object.assign(requestDto, {
              lastId: lastId.length > 0 ? lastId : undefined,
              search: keywordSearch.length > 0 ? keywordSearch : undefined
            })
          })
          const followRes: GetListMembersResponseDto =
            await followApi.searchFollowing({
              searchFollowRequestDto: {
                order: "desc",
                orderType: SearchFollowRequestDtoOrderTypeEnum.CreatedAt
              }
            })
          const curentLastId = allLists.lastId
          setFans(followRes.listMembers)
          isUpdate
            ? setList([...list, ...allLists.lists])
            : setList(allLists.lists)
          setIsLoadingMore(false)
          setLastId(curentLastId)
        } catch (error) {
          console.error(error)
        }
      }
    },
    [orderDirection, orderType, isLoadingMore, lastId, list]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeInuptSearch = useCallback(debounce(fetchList, 1000), [])

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [])

  const handleScroll = useCallback(() => {
    const isToBottom =
      window.innerHeight + window.scrollY === document.body.offsetHeight
    if (isToBottom && !isLoadingMore) {
      setIsLoadingMore(true)
      fetchList(keyword, orderType, orderDirection, true)
    }
  }, [isLoadingMore, fetchList, keyword, orderType, orderDirection])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      debounceChangeInuptSearch(value)
      setKeyword(value)
    },
    [debounceChangeInuptSearch]
  )

  const handleOpenPopper = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorSortPopperEl(anchorSortPopperEl ? null : event.currentTarget)
    },
    [anchorSortPopperEl]
  )

  const handleSaveOrdering = useCallback(
    (selection: string) => {
      const split = selection.split(":")
      const orderTypeInner = split[0] as GetListsRequestsDtoOrderTypeEnum
      const orderDirectionInner = split[1] as GetListsRequestsDtoOrderEnum

      setOrderType(orderTypeInner)
      setOrderDirection(orderDirectionInner)
      setAnchorSortPopperEl(null)
      fetchList(keyword, orderTypeInner, orderDirectionInner)
    },
    [fetchList, keyword]
  )

  const sortPopperOpen = Boolean(anchorSortPopperEl)
  const sortPopperId = sortPopperOpen ? "sort-popper" : undefined

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
              placeholder="Search list"
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

      <Popper
        id={sortPopperId}
        open={sortPopperOpen}
        anchorEl={anchorSortPopperEl}
        transition
        placement="bottom-end"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div>
              <SortListPopup
                orderType={orderType}
                orderDirection={orderDirection}
                onSave={handleSaveOrdering}
              />
            </div>
          </Fade>
        )}
      </Popper>
      <ul className="px-7 pt-40">
        <li className="flex items-center justify-end border-b-2 border-gray-500 px-7 py-5">
          <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
            <div
              aria-describedby={sortPopperId}
              onClick={handleOpenPopper}
              className="cursor-pointer"
            >
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
