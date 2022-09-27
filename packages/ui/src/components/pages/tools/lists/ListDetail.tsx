// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @next/next/no-img-element */
import {
  FollowApi,
  GetListMembersRequestDtoOrderTypeEnum,
  GetListMembersResponseDto,
  GetListResponseDto,
  ListApi,
  ListMemberDto
} from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import ChevronRight from "public/icons/chevron-right-icon.svg"
import EditIcon from "public/icons/edit-icon.svg"
import PlusIcon from "public/icons/plus-sign.svg"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import Skeleton from "src/components/molecules/Skeleton"

import ListItem from "./ListItem"

type ListDetailProps = {
  id?: string
}

const ListDetail: FC<ListDetailProps> = ({ id }) => {
  const [listInfo, setListInfo] = useState<GetListResponseDto>()
  const [listAlreadyMember, setListAlreadyMember] = useState<
    Array<ListMemberDto>
  >([])
  const [fans, setFans] = useState<Array<ListMemberDto>>([])
  const [isFetchingFanRequest, setIsFetchingFanRequest] = useState(true)
  const [fanSelectionList, setFanSelectionList] = useState<Array<string>>([])
  const [isEditingListName, setIsEditingListName] = useState<boolean>(false)
  const [listName, setListName] = useState<string>("")

  const listNameRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const fetchData = useCallback(async () => {
    const followApi = new FollowApi()
    const listApi = new ListApi()

    try {
      setIsFetchingFanRequest(true)
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
          // Get list Item in a list by listId
          const listAlreadyMemberRes: GetListMembersResponseDto =
            await listApi.getListMembers({
              getListMembersRequestDto: {
                listId: id,
                order: "desc",
                orderType: GetListMembersRequestDtoOrderTypeEnum.CreatedAt
              }
            })
          setListAlreadyMember(listAlreadyMemberRes.listMembers)
        } catch (error) {
          console.error("error ", error)
        }
      }
      const followRes: GetListMembersResponseDto = await followApi.searchFans({
        searchFollowRequestDto: {
          order: "desc",
          orderType: GetListMembersRequestDtoOrderTypeEnum.CreatedAt
        }
      })
      setFans(followRes.listMembers)
      setIsFetchingFanRequest(false)
    } catch (error) {
      console.error(error)
      setIsFetchingFanRequest(false)
    }
  }, [id])

  const handleChangeSearchFan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    if (value.trim().length > 0) {
      const filteredList = fans.filter((elm: ListMemberDto) =>
        elm.displayName.toLowerCase().includes(value)
      )
      setFans([...filteredList])
    } else {
      fetchData()
    }
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
          fetchData()
        } catch (error) {
          console.error("Remove member from a list has error: ", error)
        }
      } else {
        setFanSelectionList(
          fanSelectionList.filter((fan_id: string) => fan_id !== user_id)
        )
      }
    },
    [fanSelectionList, fetchData, id]
  )

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
          fetchData()
        } catch (error) {
          console.error("Add member to list has error: ", error)
        }
      } else {
        setFanSelectionList([...fanSelectionList, user_id])
      }
    },
    [fanSelectionList, fetchData, id]
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

  useEffect(() => {
    if (isEditingListName) {
      listNameRef.current?.focus()
    }

    // Set list name
    if (listInfo) {
      setListName(listInfo.name)
    }
  }, [isEditingListName, listInfo])

  const handleCreateNewList = useCallback(async () => {
    const listApi = new ListApi()

    try {
      await listApi.createList({
        createListRequestDto: {
          name: listName,
          userIds: fanSelectionList
        }
      })
      router.push("/tools/list")
    } catch (error) {
      console.error(error)
    }
  }, [fanSelectionList, listName, router])

  const isAlreadyInList = (userId: string, username: string): boolean => {
    if (!id) {
      return fanSelectionList.findIndex((id) => id == userId) >= 0
    }
    return listAlreadyMember.findIndex((user) => user.username == username) >= 0
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="text-white">
      <div className="-mt-[160px] flex items-center justify-between px-7">
        <h1 className="text-xl font-bold">Fan List</h1>
        <header className="flex items-center justify-end">
          <button className="ml-2 block min-h-[50px] min-w-[147px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 font-bold  shadow-sm  focus:border-blue-500 focus:outline-none focus:ring-blue-500">
            + New List
          </button>
        </header>
      </div>
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
                onChange={handleChangeSearchFan}
                placeholder="Search fan"
                className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </span>
            <FilterIcon />
          </div>
          <div className="flex items-center gap-7">
            <button className="duration-400 flex gap-2 transition-all hover:bg-white hover:bg-opacity-30">
              <PlusIcon />
              Add
            </button>
            <button
              disabled={listName.trim().length === 0}
              className={classNames({
                "duration-all transition-400 rounded-[50px] py-[10px] px-[30px] text-base font-medium text-white":
                  true,
                "cursor-not-allowed bg-slate-600": listName.trim().length === 0,
                "cursor-pointer bg-passes-pink-100": listName.trim().length > 0
              })}
              onClick={handleCreateNewList}
            >
              Save
            </button>
          </div>
        </li>
        <ConditionRendering condition={isFetchingFanRequest}>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        </ConditionRendering>

        <ConditionRendering
          condition={!isFetchingFanRequest && fans.length > 0}
        >
          {fans.map((item: ListMemberDto) => {
            const { userId, username } = item
            return (
              <ListItem
                key={userId}
                fanInfo={item}
                onRemoveFan={handleRemoveFan}
                onAddFan={handleAddFan}
                isInSelectionList={isAlreadyInList(userId, username)}
              />
            )
          })}
        </ConditionRendering>
      </ul>
    </div>
  )
}

export default ListDetail
