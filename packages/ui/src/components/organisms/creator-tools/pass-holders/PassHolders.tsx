import {
  GetPassHoldersRequestDto,
  GetPassHoldersRequestDtoOrderEnum as Order,
  GetPassHoldersRequestDtoOrderTypeEnum as OrderType,
  GetPassHoldersResponseDto,
  PassApi,
  PassHolderDto
} from "@passes/api-client"
import { debounce } from "lodash"
import { useRouter } from "next/router"
import SearchOutlineIcon from "public/icons/search-outline-icon.svg"
import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Select } from "src/components/atoms/input/Select"
import { SortDropdown, SortOption } from "src/components/organisms/SortDropdown"
import { formatText } from "src/helpers/formatters"
import { usePass } from "src/hooks/entities/usePass"
import { ArrowLeft } from "src/icons/ArrowLeft"
import { InfoIconOutlined } from "src/icons/InfoIconOutlined"
import { PassHolderMember } from "./PassHolderMember"

type PassHoldersProps = {
  passId: string
}

const api = new PassApi()
const DEBOUNCE_TIMEOUT = 500

export const PassHolders: FC<PassHoldersProps> = ({ passId }) => {
  const [search, setSearch] = useState<string>("")

  const [orderType, setOrderType] = useState<OrderType>(OrderType.CreatedAt)
  const [order, setOrder] = useState<Order>(Order.Desc)

  const { pass, mutate } = usePass(passId)

  const { register, watch, setValue } = useForm<{ active?: boolean }>({
    defaultValues: { active: undefined }
  })

  useEffect(() => {
    mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const active = watch("active")

  const fetchProps = useMemo(() => {
    return {
      order,
      orderType,
      search,
      passId,
      active
    }
  }, [order, orderType, search, passId, active])

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

  const router = useRouter()

  const keyedComponent = useCallback(({ arg }: ComponentArg<PassHolderDto>) => {
    return <PassHolderMember key={arg.passHolderId} passHolder={arg} />
  }, [])

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
            <div className="flex items-center">
              <h2 className="whitespace-pre-wrap pr-[10px] text-2xl font-bold">
                {formatText(pass?.title)}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-center gap-[30px]">
            <span className="relative opacity-70 hover:opacity-100">
              <SearchOutlineIcon className="absolute left-0 top-[8px] z-10" />
              <input
                className="block min-h-[50px] min-w-[296px] appearance-none rounded-md border bg-transparent p-2 py-3 px-4 pl-[33px] text-sm shadow-sm placeholder:text-gray-400 read-only:pointer-events-none read-only:bg-gray-200 focus:border-passes-pink-100/80 focus:outline-none "
                onChange={handleChangeSearch}
                placeholder="Search pass holders"
                type="text"
              />
            </span>
            <Select
              className="min-w-[100px] border-gray-500"
              defaultValue="None"
              name="active"
              onChange={(value) => setValue("active", value)}
              register={register}
              selectOptions={[
                {
                  value: undefined,
                  label: "None"
                },
                {
                  value: true,
                  label: "Active"
                },
                {
                  value: false,
                  label: "Expired"
                }
              ]}
            />
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
                },
                {
                  orderType: OrderType.Spent,
                  order: "desc"
                }
              ]}
              selection={{ orderType, order }}
            />
          </div>
        </li>
        <InfiniteScrollPagination<PassHolderDto, GetPassHoldersResponseDto>
          KeyedComponent={keyedComponent}
          emptyElement={
            <div className="mt-[10px] flex h-[40px] w-full flex-row items-center justify-between rounded-[6px] border border-[#2C282D] bg-gradient-to-r from-[#bf7af04d] to-[#000] px-[10px]">
              <div className="flex flex-row items-center gap-[10px]">
                <InfoIconOutlined />
                <span>No pass holders yet</span>
              </div>
            </div>
          }
          fetch={async (req: GetPassHoldersRequestDto) => {
            return await api.getPassHolders({
              getPassHoldersRequestDto: req
            })
          }}
          fetchProps={fetchProps}
          keySelector="passHolderId"
          keyValue={`/pages/pass-holders/${passId}`}
        />
      </ul>
    </div>
  )
}
