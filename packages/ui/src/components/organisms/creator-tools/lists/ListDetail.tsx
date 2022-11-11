import {
  GetListMembersRequestDto,
  GetListMembersRequestDtoOrderEnum as Order,
  GetListMembersRequestDtoOrderTypeEnum as OrderType,
  GetListMembersResponseDto,
  GetListResponseDto,
  GetListResponseDtoTypeEnum,
  ListApi,
  ListDtoTypeEnum,
  ListMemberDto
} from "@passes/api-client"
import { debounce } from "lodash"
import { useRouter } from "next/router"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import React, { FC, useCallback, useEffect, useMemo, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { AddFollowerToListModal } from "src/components/molecules/list/AddFollowerToListModal"
import { UpdateListNamePopper } from "src/components/molecules/list/UpdateListNamePopper"
import { errorMessage } from "src/helpers/error"
import { formatText } from "src/helpers/formatters"
import { AddIcon } from "src/icons/AddIcon"
import { ArrowLeft } from "src/icons/ArrowLeft"
import { InfoIconOutlined } from "src/icons/InfoIconOutlined"
import { ListMember } from "./ListMember"
import { SortDropdown, SortOption } from "./SortDropdown"

type ListDetailProps = {
  listId: string
}

const listApi = new ListApi()
const DEBOUNCE_TIMEOUT = 500

const ListDetail: FC<ListDetailProps> = ({ listId }) => {
  const [listInfo, setListInfo] = useState<GetListResponseDto>()
  const [listName, setListName] = useState<string>("")
  const [addFollowerOpen, setAddFollowerOpen] = useState<boolean>(false)

  const [search, setSearch] = useState<string>("")

  const [orderType, setOrderType] = useState<OrderType>(OrderType.CreatedAt)
  const [order, setOrder] = useState<Order>(Order.Desc)

  const [newListsMembers, setNewListsMembers] = useState<ListMemberDto[]>([])

  const fetchInfo = useCallback(async () => {
    try {
      // Get list information by ID
      const listInfoRes: GetListResponseDto = await listApi.getList({
        listId
      })
      setListInfo(listInfoRes)
      setListName(listInfoRes.name ?? "")
    } catch (error) {
      errorMessage(error, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProps = useMemo(() => {
    return {
      order,
      orderType,
      search,
      listId
    }
  }, [order, orderType, search, listId])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
    }, DEBOUNCE_TIMEOUT),
    []
  )

  const onSortSelect = async ({
    orderType,
    order
  }: SortOption<OrderType, Order>) => {
    setOrderType(orderType)
    setOrder(order || "desc")
  }

  const handleRemoveFan = useCallback(
    async (user_id: string) => {
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
    },
    [listId]
  )

  const handleAddFan = useCallback(
    async (user: ListMemberDto) => {
      try {
        await listApi.addListMembers({
          addListMembersRequestDto: {
            listId,
            userIds: [user.userId]
          }
        })
        setNewListsMembers((listMembers) => [...listMembers, user])
      } catch (error) {
        errorMessage(error, true)
      }
    },
    [listId]
  )

  const handleEditListName = useCallback(
    async (value: string) => {
      if (value.length === 0) {
        return
      }
      // Update list name
      try {
        const updated = (
          await listApi.editListName({
            editListNameRequestDto: {
              listId,
              name: value
            }
          })
        ).value
        if (updated) {
          setListName(value)
        }
      } catch (error) {
        errorMessage(error, true)
      }
    },
    [listId]
  )

  const router = useRouter()
  useEffect(() => {
    setNewListsMembers([])
  }, [fetchProps])

  const keyedComponent = useCallback(
    ({ arg }: ComponentArg<ListMemberDto>) => {
      return (
        <ListMember
          fanInfo={arg}
          key={arg.listMemberId}
          onRemoveFan={handleRemoveFan}
          removable={listInfo?.type === ListDtoTypeEnum.Normal}
        />
      )
    },
    [handleRemoveFan, listInfo?.type]
  )

  useEffect(() => {
    if (listInfo?.type === ListDtoTypeEnum.TopSpenders) {
      setOrderType(OrderType.Metadata)
    }
  }, [listInfo])

  return (
    <div className="relative text-white">
      <div className="absolute top-[38px] left-[-20px] flex items-center justify-between gap-[10px] px-7">
        <div onClick={() => router.back()}>
          <ArrowLeft className="cursor-pointer" height="16" width="16" />
        </div>
      </div>
      <ul className="px-7">
        <li className="flex flex-wrap items-center justify-between gap-[20px] border-b-2 border-gray-500 py-5">
          <div className="flex flex-wrap items-center gap-[10px]">
            <div
              className={
                "flex items-center" +
                (listInfo?.type === GetListResponseDtoTypeEnum.Normal
                  ? "border-r border-r-[#fff]"
                  : "")
              }
            >
              <h2 className="whitespace-pre-wrap pr-[10px] text-2xl font-bold">
                {formatText(listName)}
              </h2>
            </div>
            {listInfo?.type === GetListResponseDtoTypeEnum.Normal && (
              <UpdateListNamePopper
                onSubmit={handleEditListName}
                value={listName}
              />
            )}
          </div>
          <div className="flex items-center justify-center gap-[30px]">
            <span className="relative opacity-70 hover:opacity-100">
              <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
              <input
                className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm shadow-sm placeholder:text-gray-400 read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                onChange={handleChangeSearch}
                placeholder="Search list"
                type="text"
              />
            </span>
            {listInfo &&
            listInfo.type === GetListResponseDtoTypeEnum.TopSpenders ? (
              <SortDropdown
                onSelect={onSortSelect}
                options={[
                  {
                    orderType: OrderType.Username,
                    order: "asc"
                  },
                  {
                    orderType: OrderType.Username,
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
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            {listInfo?.type === ListDtoTypeEnum.Normal && (
              <Button
                className="font-[700]"
                icon={<AddIcon />}
                onClick={() => setAddFollowerOpen(true)}
              >
                Add
              </Button>
            )}
          </div>
        </li>
        <InfiniteScrollPagination<ListMemberDto, GetListMembersResponseDto>
          KeyedComponent={keyedComponent}
          emptyElement={
            <div className="mt-[10px] flex h-[40px] w-full flex-row items-center justify-between rounded-[6px] border border-[#2C282D] bg-gradient-to-r from-[#bf7af04d] to-[#000] px-[10px]">
              <div className="flex flex-row items-center gap-[10px]">
                <InfoIconOutlined />
                <span>
                  {listInfo?.type === ListDtoTypeEnum.Followers
                    ? "You have no followers yet."
                    : listInfo?.type === ListDtoTypeEnum.Following
                    ? "You are not following anyone yet."
                    : listInfo?.type === ListDtoTypeEnum.TopSpenders
                    ? "No spenders yet."
                    : "Users you add to the list will be shown here:"}
                </span>
              </div>
            </div>
          }
          fetch={async (req: GetListMembersRequestDto) => {
            return await listApi.getListMembers({
              getListMembersRequestDto: req
            })
          }}
          fetchProps={fetchProps}
          hasInitialElement={newListsMembers.length > 0}
          keySelector="userId"
          keyValue={`list/list-members/${listId}`}
        >
          {newListsMembers.map((listMember, index) => (
            <ListMember
              fanInfo={listMember}
              key={index}
              onRemoveFan={handleRemoveFan}
              removable
            />
          ))}
        </InfiniteScrollPagination>
      </ul>
      <AddFollowerToListModal
        isOpen={addFollowerOpen}
        listId={listId}
        onSubmit={handleAddFan}
        setOpen={setAddFollowerOpen}
      />
    </div>
  )
}

export default ListDetail // eslint-disable-line import/no-default-export
