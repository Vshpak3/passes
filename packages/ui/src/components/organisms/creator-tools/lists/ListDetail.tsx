import { Fade, Popper } from "@mui/material"
import {
  GetListMembersRequestDto,
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
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { FollowerSearchBar } from "src/components/molecules/FollowerSearchBar"
import { errorMessage } from "src/helpers/error"

import { ListMember } from "./ListMember"
import { SortListPopup } from "./SortListPopup"

type ListDetailProps = {
  listId: string
}

const listApi = new ListApi()
const DEBOUNCE_TIMEOUT = 500

const ListDetail: FC<ListDetailProps> = ({ listId }) => {
  const [listInfo, setListInfo] = useState<GetListResponseDto>()
  const [listName, setListName] = useState<string>("")
  // const [addFollowerOpen, setAddFollowerOpen] = useState<boolean>(false)

  const [resets, setResets] = useState(0)
  const [search, setSearch] = useState<string>("")

  const [orderType, setOrderType] =
    useState<GetListMembersRequestDtoOrderTypeEnum>(
      GetListMembersRequestDtoOrderTypeEnum.CreatedAt
    )

  const [order, setOrder] = useState<GetListMembersRequestDtoOrderEnum>(
    GetListMembersRequestDtoOrderEnum.Asc
  )

  const [isEditingListName, setIsEditingListName] = useState<boolean>(false)
  const [anchorSortPopperEl, setAnchorSortPopperEl] =
    useState<null | HTMLElement>(null)

  const listNameRef = useRef<HTMLInputElement>(null)

  const fetchInfo = useCallback(async () => {
    try {
      // Get list information by ID
      const listInfoRes: GetListResponseDto = await listApi.getList({
        listId
      })
      setListInfo(listInfoRes)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      listNameRef.current!.value = listInfoRes.name
      setListName(listInfoRes.name)
    } catch (error) {
      errorMessage(error, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
      setResets(resets + 1)
    }, DEBOUNCE_TIMEOUT),
    [resets, setSearch]
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
    setAnchorSortPopperEl(null)
  }

  const handleRemoveFan = async (user_id: string) => {
    try {
      await listApi.removeListMembers({
        removeListMembersRequestDto: {
          listId,
          userIds: [user_id]
        }
      })
    } catch (error) {
      errorMessage(error, true)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddFan = useCallback(
    async (user_id: string) => {
      try {
        await listApi.addListMembers({
          addListMembersRequestDto: {
            listId,
            userIds: [user_id]
          }
        })
        await new Promise((resolve) => setTimeout(resolve, 100))
        setResets(resets + 1)
      } catch (error) {
        errorMessage(error, true)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resets, setResets]
  )

  const handleChangeListName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setListName(event.target.value)
    },
    []
  )

  const toggleEditListName = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      const inputListNameValue = listNameRef.current?.value ?? ""
      if (
        isEditingListName &&
        listNameRef.current &&
        inputListNameValue.length > 0
      ) {
        // Update list name
        try {
          const updated = (
            await listApi.editListName({
              editListNameRequestDto: {
                listId,
                name: listNameRef.current?.value
              }
            })
          ).value
          if (updated) {
            setListName(listNameRef.current?.value)
          }
          setIsEditingListName((isEditingListName) => !isEditingListName)
        } catch (error) {
          errorMessage(error, true)
        }
      } else {
        setIsEditingListName((isEditingListName) => !isEditingListName)
      }
    },
    [listId, isEditingListName]
  )

  const sortPopperOpen = Boolean(anchorSortPopperEl)
  const sortPopperId = sortPopperOpen ? "sort-popper" : undefined

  return (
    <div className="text-white">
      <div className="-mt-[160px] flex items-center justify-between px-7">
        <h1 className="text-xl font-bold">List Members</h1>
      </div>
      <ul className="px-7 pt-[82px]">
        <li className="mb-3 flex items-center text-base font-medium leading-5 text-white">
          <span>List</span>
          <ChevronRight className="mx-[11px]" />
          <span>Details</span>
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
            {listInfo?.type === GetListResponseDtoTypeEnum.Normal && (
              <span className="cursor-pointer" onClick={toggleEditListName}>
                <EditIcon />
              </span>
            )}
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
            <FollowerSearchBar onSelect={handleAddFan} />
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

        <InfiniteScrollPagination<ListMemberDto, GetListMembersResponseDto>
          keyValue={`list/list-members/${listId}`}
          fetch={async (req: GetListMembersRequestDto) => {
            return await listApi.getListMembers({
              getListMembersRequestDto: req
            })
          }}
          fetchProps={{ order, orderType, search, listId }}
          KeyedComponent={({ arg }: ComponentArg<ListMemberDto>) => {
            return (
              <ListMember
                fanInfo={arg}
                removable={true}
                onRemoveFan={handleRemoveFan}
              />
            )
          }}
          resets={resets}
        />
      </ul>
    </div>
  )
}

export default ListDetail // eslint-disable-line import/no-default-export
