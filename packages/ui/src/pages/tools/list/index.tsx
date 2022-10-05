import { Fade } from "@mui/material"
import Popper from "@mui/material/Popper"
import {
  GetListsRequestsDtoOrderEnum,
  GetListsRequestsDtoOrderTypeEnum,
  ListDto,
  ListDtoTypeEnum
} from "@passes/api-client"
import { ListApi } from "@passes/api-client/apis"
import { debounce } from "lodash"
import { NextPage } from "next"
import Link from "next/link"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import React, { useCallback, useEffect, useState } from "react"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import SortListPopup from "src/components/pages/tools/lists/SortListPopup"
import { withPageLayout } from "src/layout/WithPageLayout"

const listApi = new ListApi()

const DEBOUNCE_TIMEOUT = 500

const FanLists: NextPage = () => {
  const [lists, setLists] = useState<Array<ListDto>>([])
  const [resets, setResets] = useState(0)

  const [orderType, setOrderType] = useState<GetListsRequestsDtoOrderTypeEnum>(
    GetListsRequestsDtoOrderTypeEnum.Name
  )
  const [order, setOrder] = useState<GetListsRequestsDtoOrderEnum>(
    GetListsRequestsDtoOrderEnum.Asc
  )
  const [lastId, setLastId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState<string>("")
  const [createdAt, setCreatedAt] = useState<Date | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)

  const [listName, setListName] = useState<string>("")
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [anchorSortPopperEl, setAnchorSortPopperEl] =
    useState<null | HTMLElement>(null)

  const fetchList = useCallback(async () => {
    const curResets = resets
    if (!isLoadingMore) {
      setIsLoadingMore(true)
      try {
        const newLists = await listApi.getLists({
          getListsRequestsDto: {
            order,
            orderType,
            lastId,
            search: search && search.length > 0 ? search : undefined,
            name,
            createdAt
          }
        })
        if (curResets === resets && newLists.lists.length > 0) {
          setLists([...lists, ...newLists.lists])
          setLastId(newLists.lastId)
          setCreatedAt(newLists.createdAt)
          setName(newLists.name)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoadingMore(false)
      }
    }
  }, [
    isLoadingMore,
    resets,
    order,
    orderType,
    lastId,
    search,
    name,
    createdAt,
    lists
  ])

  useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resets])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    debounce(async () => {
      const isToBottom =
        window.innerHeight + window.scrollY === document.body.offsetHeight
      // window.removeEventListener("scroll", handleScroll)
      if (isToBottom) {
        await fetchList()
      }
    }, 50),
    [fetchList]
  )

  useEffect(() => {
    // clean up code
    window.addEventListener("wheel", handleScroll, { passive: true })
    return () => window.removeEventListener("wheel", handleScroll)
  }, [handleScroll])

  const reset = useCallback(() => {
    setLastId(undefined)
    setIsLoadingMore(false)
    setName(undefined)
    setCreatedAt(undefined)
    setLists([])
    setResets(resets + 1)
  }, [resets])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
      reset()
    }, DEBOUNCE_TIMEOUT),
    [reset, setSearch]
  )

  const handleOpenPopper = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorSortPopperEl(anchorSortPopperEl ? null : event.currentTarget)
    },
    [anchorSortPopperEl]
  )

  const handleSaveOrdering = async (selection: string) => {
    const split = selection.split(":")
    const orderTypeInner = split[0] as GetListsRequestsDtoOrderTypeEnum
    const orderInner = split[1] as GetListsRequestsDtoOrderEnum

    setOrderType(orderTypeInner)
    setOrder(orderInner)
    reset()
    setAnchorSortPopperEl(null)
  }

  const handleCreateNewList = async (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      await listApi.createList({
        createListRequestDto: {
          name: listName,
          userIds: []
        }
      })
      reset()
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const deleted = (await listApi.deleteList({ listId: event.target.value }))
        .value
      if (deleted) {
        setLists(lists.filter((list) => list.listId !== event.target.value))
      }
    } catch (error) {
      console.error(error)
    }
  }
  const sortPopperOpen = Boolean(anchorSortPopperEl)
  const sortPopperId = sortPopperOpen ? "sort-popper" : undefined

  return (
    <div className="text-white">
      <div className="-mt-[160px] flex items-center justify-between px-7">
        <h1 className="text-xl font-bold">My Lists</h1>
        <header className="flex items-center justify-end">
          <span className="relative">
            <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
            <input
              type="text"
              onChange={handleChangeSearch}
              placeholder="Search list"
              className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="new list name"
              onInput={(e) => setListName((e.target as HTMLInputElement).value)}
              className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            <button
              className="ml-2 block min-h-[50px] min-w-[147px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 font-bold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              onClick={handleCreateNewList}
            >
              + New List
            </button>
          </span>
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
                defaultOption={{ orderType, order }}
                options={[
                  {
                    orderType: GetListsRequestsDtoOrderTypeEnum.Name,
                    order: "asc"
                  },
                  {
                    orderType: GetListsRequestsDtoOrderTypeEnum.Name,
                    order: "desc"
                  },
                  {
                    orderType: GetListsRequestsDtoOrderTypeEnum.CreatedAt,
                    order: "asc"
                  },
                  {
                    orderType: GetListsRequestsDtoOrderTypeEnum.CreatedAt,
                    order: "desc"
                  }
                ]}
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
        {lists &&
          lists.map((list) => (
            <Link href={`/tools/list/${list.listId}`} key={list.listId}>
              <li className="duration-400 cursor-pointer border-b-2 border-gray-500 px-7 py-5 transition-all hover:bg-white/20">
                <h1 className="text-xl font-bold">
                  {list.name || list.listId}
                </h1>
                <span className="text-base font-bold text-gray-500">
                  &nbsp; {list.count}
                </span>

                <ConditionRendering
                  condition={list.type === ListDtoTypeEnum.Normal}
                >
                  <button value={list.listId} onClick={handleDelete}>
                    delete
                  </button>
                </ConditionRendering>
              </li>
            </Link>
          ))}
      </ul>
    </div>
  )
}

export default withPageLayout(FanLists)
