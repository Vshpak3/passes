import { Fade, Popper } from "@mui/material"
import {
  GetListMembersRequestDtoOrderEnum,
  GetListMembersRequestDtoOrderTypeEnum,
  GetListMembersResponseDto,
  GetListResponseDto,
  GetListResponseDtoTypeEnum,
  ListApi,
  ListMemberDto
} from "@passes/api-client"
import { debounce } from "lodash"
import ChevronRight from "public/icons/chevron-right-icon.svg"
import EditIcon from "public/icons/edit-icon.svg"
import PlusIcon from "public/icons/plus-sign.svg"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import ConditionRendering from "src/components/molecules/ConditionRendering"

import ListItem from "./ListItem"
import SortListPopup from "./SortListPopup"

type ListDetailProps = {
  id?: string
}

const ListDetail: FC<ListDetailProps> = ({ id }) => {
  const [listInfo, setListInfo] = useState<GetListResponseDto>()
  const [listName, setListName] = useState<string>("")

  const [listMembers, setListMembers] = useState<Array<ListMemberDto>>([])
  const [resets, setResets] = useState(0)

  const [orderType, setOrderType] =
    useState<GetListMembersRequestDtoOrderTypeEnum>(
      GetListMembersRequestDtoOrderTypeEnum.CreatedAt
    )

  const [order, setOrder] = useState<GetListMembersRequestDtoOrderEnum>(
    GetListMembersRequestDtoOrderEnum.Asc
  )
  const [lastId, setLastId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState<string>("")
  const [createdAt, setCreatedAt] = useState<Date | undefined>(undefined)
  const [username, setUsername] = useState<string | undefined>(undefined)

  const [isEditingListName, setIsEditingListName] = useState<boolean>(false)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [anchorSortPopperEl, setAnchorSortPopperEl] =
    useState<null | HTMLElement>(null)

  const listNameRef = useRef<HTMLInputElement>(null)

  const fetchInfo = useCallback(async () => {
    const listApi = new ListApi()
    if (id) {
      try {
        // Get list information by ID
        const listInfoRes: GetListResponseDto = await listApi.getList({
          listId: id
        })
        setListInfo(listInfoRes)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        listNameRef.current!.value = listInfoRes.name
        setListName(listInfoRes.name)
      } catch (error) {
        console.error("error ", error)
      }
    }
  }, [id])

  const fetchMembers = useCallback(async () => {
    const listApi = new ListApi()
    if (!isLoadingMore) {
      setIsLoadingMore(true)
      const curResets = resets
      try {
        if (id) {
          try {
            // Get list Item in a list by listId
            const listMembers: GetListMembersResponseDto =
              await listApi.getListMembers({
                getListMembersRequestDto: {
                  listId: id,
                  order,
                  orderType,
                  search,
                  createdAt,
                  username,
                  lastId
                }
              })
            if (curResets === resets) {
              setListMembers(listMembers.listMembers)
              setLastId(listMembers.lastId)
              setCreatedAt(listMembers.createdAt)
              setUsername(listMembers.username)
            }
          } catch (error) {
            console.error("error ", error)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoadingMore(false)
      }
    }
  }, [
    createdAt,
    id,
    isLoadingMore,
    lastId,
    order,
    orderType,
    resets,
    search,
    username
  ])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeInputSearch = useCallback(
    debounce(fetchMembers, 1000),
    []
  )

  useEffect(() => {
    fetchMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resets])

  useEffect(() => {
    fetchInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = useCallback(async () => {
    const isToBottom =
      window.innerHeight + window.scrollY === document.body.offsetHeight

    window.removeEventListener("scroll", handleScroll)
    if (isToBottom) {
      await fetchMembers()
    }
  }, [fetchMembers])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
  }, [handleScroll])

  const reset = useCallback(() => {
    setLastId(undefined)
    setIsLoadingMore(false)
    setUsername(undefined)
    setCreatedAt(undefined)
    setListMembers([])
    setResets(resets + 1)
  }, [resets])

  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      debounceChangeInputSearch()
      setSearch(value)
      reset()
    },
    [debounceChangeInputSearch, reset]
  )

  const handleOpenPopper = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorSortPopperEl(anchorSortPopperEl ? null : event.currentTarget)
    },
    [anchorSortPopperEl]
  )

  const handleSaveOrdering = async (selection: string) => {
    const split = selection.split(":")
    const orderTypeInner = split[0] as GetListMembersRequestDtoOrderTypeEnum
    const orderInner = split[1] as GetListMembersRequestDtoOrderEnum

    setOrderType(orderTypeInner)
    setOrder(orderInner)
    reset()
    setAnchorSortPopperEl(null)
  }

  const handleRemoveFan = useCallback(
    async (event: React.MouseEvent<HTMLSpanElement>, user_id: string) => {
      const listApi = new ListApi()

      event.preventDefault()
      event.stopPropagation()
      if (id) {
        try {
          await listApi.removeListMembers({
            removeListMembersRequestDto: {
              listId: id,
              userIds: [user_id]
            }
          })
          reset()
        } catch (error) {
          console.error("Remove member from a list has error: ", error)
        }
      }
    },
    [id, reset]
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddFan = useCallback(
    async (event: React.MouseEvent<HTMLSpanElement>, user_id: string) => {
      const listApi = new ListApi()

      event.preventDefault()
      event.stopPropagation()
      if (id) {
        try {
          await listApi.addListMembers({
            addListMembersRequestDto: {
              listId: id,
              userIds: [user_id]
            }
          })
          reset()
        } catch (error) {
          console.error("Add member to list has error: ", error)
        }
      }
    },
    [id, reset]
  )

  const handleChangeListName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setListName(event.target.value)
    },
    []
  )

  const toggleEditListName = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      const listApi = new ListApi()

      event.preventDefault()
      const inputListNameValue = listNameRef.current?.value ?? ""
      if (
        id &&
        isEditingListName &&
        listNameRef.current &&
        inputListNameValue.length > 0
      ) {
        // Update list name
        try {
          await listApi.editListName({
            editListNameRequestDto: {
              listId: id,
              name: listNameRef.current?.value
            }
          })
          setIsEditingListName((isEditingListName) => !isEditingListName)
        } catch (error) {
          console.warn("Update list name error, status: ", error)
        }
      } else {
        setIsEditingListName((isEditingListName) => !isEditingListName)
      }
    },
    [id, isEditingListName]
  )

  const sortPopperOpen = Boolean(anchorSortPopperEl)
  const sortPopperId = sortPopperOpen ? "sort-popper" : undefined

  useEffect(() => {
    if (isEditingListName) {
      listNameRef.current?.focus()
    }

    // Set list name
    if (listInfo) {
      setListName(listInfo.name)
    }
  }, [isEditingListName, listInfo])

  return (
    <div className="text-white">
      <ul className="px-7 pt-[82px]">
        <li className="mb-3 flex items-center text-base font-medium leading-5 text-white">
          <span>List</span>
          <ChevronRight className="mx-[11px]" />
          <span>Fan</span>
        </li>
        <li className="flex items-center justify-between border-b-2 border-gray-500 py-5">
          <div className="flex items-center ">
            <input
              onChange={handleChangeListName}
              ref={listNameRef}
              disabled={!isEditingListName}
              className="mr-2 w-[160px] appearance-none bg-transparent text-2xl font-bold leading-6 outline-none"
              value={listName}
            />

            <span className="cursor-pointer" onClick={toggleEditListName}>
              <EditIcon />
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
            <span className="relative">
              <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
              <input
                type="text"
                onChange={handleChangeSearch}
                placeholder="Search list"
                className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
            <div
              aria-describedby={sortPopperId}
              onClick={handleOpenPopper}
              className="cursor-pointer"
            >
              <FilterIcon />
            </div>
          </div>
          <ConditionRendering
            condition={listInfo?.type === GetListResponseDtoTypeEnum.Normal}
          >
            <div className="flex items-center gap-7">
              <button className="duration-400 flex gap-2 transition-all hover:bg-white hover:bg-opacity-30">
                <PlusIcon />
                Add
              </button>
            </div>
          </ConditionRendering>
        </li>
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
                      orderType: GetListMembersRequestDtoOrderTypeEnum.Username,
                      order: "asc"
                    },
                    {
                      orderType: GetListMembersRequestDtoOrderTypeEnum.Username,
                      order: "desc"
                    },
                    {
                      orderType:
                        GetListMembersRequestDtoOrderTypeEnum.CreatedAt,
                      order: "asc"
                    },
                    {
                      orderType:
                        GetListMembersRequestDtoOrderTypeEnum.CreatedAt,
                      order: "desc"
                    }
                  ]}
                  onSave={handleSaveOrdering}
                />
              </div>
            </Fade>
          )}
        </Popper>

        <ConditionRendering condition={listMembers.length > 0}>
          {listMembers.map((item: ListMemberDto) => {
            const { userId } = item
            return (
              <ListItem
                key={userId}
                fanInfo={item}
                onRemoveFan={handleRemoveFan}
                removable={true}
              />
            )
          })}
        </ConditionRendering>
      </ul>
    </div>
  )
}

export default ListDetail
