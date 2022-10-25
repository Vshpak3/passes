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
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/router"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import React, { FC, useCallback, useEffect, useState } from "react"

import { Button } from "src/components/atoms/Button"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { AddFollowerToListModal } from "src/components/molecules/list/AddFollowerToListModal"
import { UpdateListNamePopper } from "src/components/molecules/list/UpdateListNamePopper"
import { errorMessage } from "src/helpers/error"
import { AddIcon } from "src/icons/AddIcon"
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

  const [resets, setResets] = useState(0)
  const [search, setSearch] = useState<string>("")

  const [orderType, setOrderType] = useState<OrderType>(OrderType.CreatedAt)
  const [order, setOrder] = useState<Order>(Order.Asc)

  const fetchInfo = useCallback(async () => {
    try {
      // Get list information by ID
      const listInfoRes: GetListResponseDto = await listApi.getList({
        listId
      })
      setListInfo(listInfoRes)
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
    [resets]
  )

  const onSortSelect = async ({
    orderType,
    order
  }: SortOption<OrderType, Order>) => {
    setOrderType(orderType)
    setOrder(order || "desc")
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

  return (
    <div className="text-white">
      <div className="absolute top-[160px] flex items-center justify-between gap-[10px] px-7">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-xl font-bold">{listName}</h1>
      </div>
      <ul className="px-7">
        <li className="flex items-center justify-between border-b-2 border-gray-500 py-5">
          <div className="flex items-center gap-[10px]">
            <div
              className={
                "flex items-center" +
                (listInfo?.type === GetListResponseDtoTypeEnum.Normal
                  ? "border-r border-r-[#fff]"
                  : "")
              }
            >
              <h2 className="pr-[10px] text-2xl font-bold">{listName}</h2>
            </div>
            {listInfo?.type === GetListResponseDtoTypeEnum.Normal && (
              <UpdateListNamePopper
                onSubmit={(value) => handleEditListName(value)}
                value={listName}
              />
            )}
          </div>
          <div className="flex items-center justify-center gap-[30px]">
            <span className="relative opacity-70 hover:opacity-100">
              <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
              <input
                type="text"
                onChange={handleChangeSearch}
                placeholder="Search list"
                className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </span>
            <SortDropdown
              selection={{ orderType, order }}
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
              onSelect={onSortSelect}
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            {listInfo?.type === ListDtoTypeEnum.Normal && (
              <Button
                icon={<AddIcon />}
                className="font-[700]"
                onClick={() => setAddFollowerOpen(true)}
              >
                Add
              </Button>
            )}
          </div>
        </li>
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
                removable={listInfo?.type === ListDtoTypeEnum.Normal}
                onRemoveFan={handleRemoveFan}
              />
            )
          }}
          resets={resets}
          emptyElement={
            <div className="mt-[10px] flex h-[40px] w-full flex-row items-center  justify-between rounded-[6px] border border-[#2C282D] bg-gradient-to-r from-[#bf7af04d] to-[#000] px-[10px]">
              <div className="flex flex-row items-center gap-[10px]">
                <InfoIconOutlined />
                <span>
                  {listInfo?.type === ListDtoTypeEnum.Followers
                    ? "You have no followers yet."
                    : listInfo?.type === ListDtoTypeEnum.Following
                    ? "You are not following anyone yet."
                    : "Users you add to the list will be shown here:"}
                </span>
              </div>
            </div>
          }
        />
      </ul>
      <AddFollowerToListModal
        onSubmit={(userId) => handleAddFan(userId)}
        isOpen={addFollowerOpen}
        setOpen={setAddFollowerOpen}
      />
    </div>
  )
}

export default ListDetail // eslint-disable-line import/no-default-export
