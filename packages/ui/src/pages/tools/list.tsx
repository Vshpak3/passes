import { Fade } from "@mui/material"
import Popper from "@mui/material/Popper"
import {
  GetListsRequestsDto,
  GetListsRequestsDtoOrderEnum,
  GetListsRequestsDtoOrderTypeEnum,
  GetListsResponseDto,
  ListDto
} from "@passes/api-client"
import { ListApi } from "@passes/api-client/apis"
import { debounce } from "lodash"
import { NextPage } from "next"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import React, { useCallback, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { CreateNewListModal } from "src/components/molecules/list/CreateNewListModal"
import { List } from "src/components/organisms/creator-tools/lists/List"
import { SortListPopup } from "src/components/organisms/creator-tools/lists/SortListPopup"
import { errorMessage } from "src/helpers/error"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const listApi = new ListApi()

const DEBOUNCE_TIMEOUT = 500

const FanLists: NextPage = () => {
  const [resets, setResets] = useState(0)
  const [newListModalState, setNewListModalState] = useState(false)

  const [orderType, setOrderType] = useState<GetListsRequestsDtoOrderTypeEnum>(
    GetListsRequestsDtoOrderTypeEnum.Name
  )
  const [order, setOrder] = useState<GetListsRequestsDtoOrderEnum>(
    GetListsRequestsDtoOrderEnum.Asc
  )
  const [search, setSearch] = useState<string>("")
  const [anchorSortPopperEl, setAnchorSortPopperEl] =
    useState<null | HTMLElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeSearch = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase()
      setSearch(value)
    }, DEBOUNCE_TIMEOUT),
    [setSearch]
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
    setAnchorSortPopperEl(null)
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

  const sortPopperOpen = Boolean(anchorSortPopperEl)
  const sortPopperId = sortPopperOpen ? "sort-popper" : undefined

  return (
    <div className="text-white">
      <div className="absolute top-[160px] flex w-[-webkit-fill-available] items-center justify-between px-7">
        <h1 className="text-xl font-bold">My Lists</h1>
        <div className="relative flex items-center justify-end">
          <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
          <input
            type="text"
            onChange={handleChangeSearch}
            placeholder="Search list"
            className="block min-h-[50px] min-w-[296px] appearance-none rounded-[6px] border border-[#624256] bg-transparent p-2 py-3 px-4 pl-[33px] text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            className="ml-2 block min-h-[50px] min-w-[147px] appearance-none rounded-[6px] border border-[#624256] bg-transparent p-2 py-3 px-4 font-bold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            onClick={handleCreateNewListModal}
          >
            + New List
          </button>
        </div>
      </div>

      <CreateNewListModal
        onSubmit={handleCreateNewList}
        isOpen={newListModalState}
        setOpen={setNewListModalState}
      />

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

      <ul className="px-7 ">
        <li className="flex items-center justify-between py-5">
          <div className="flex flex-row justify-between gap-[32px] border-b border-[#2C282D]">
            <span className="cursor-pointer border-b-[3px] border-b-[#9C4DC1] py-[16px] px-[12px] text-base font-bold">
              Created List
            </span>
            <span className="cursor-pointer py-[16px] px-[12px] text-base font-bold opacity-[0.5]">
              Pass Holders
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
        </li>
        <InfiniteScrollPagination<ListDto, GetListsResponseDto>
          keyValue="/lists"
          fetch={async (req: GetListsRequestsDto) => {
            return await listApi.getLists({ getListsRequestsDto: req })
          }}
          fetchProps={{ order, orderType, search }}
          KeyedComponent={({ arg }: ComponentArg<ListDto>) => {
            return <List list={arg} removable={true} />
          }}
          resets={resets}
        />
      </ul>
    </div>
  )
}

export default WithNormalPageLayout(FanLists, { creatorOnly: true })
