import { ListApi, ListDto, ListDtoTypeEnum } from "@passes/api-client"
import Link from "next/link"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/Button"
import { IconTooltip } from "src/components/atoms/IconTooltip"
import { AlertIcon } from "src/icons/AlertIcon"
import { DeleteIcon } from "src/icons/DeleteIcon"

interface ListProps {
  list: ListDto
  removable?: boolean
}

export const List: FC<ListProps> = ({ list, removable }) => {
  const [removed, setRemoved] = useState<boolean>(false)
  return (
    <>
      {!removed && (
        <li className="duration-400 flex cursor-pointer flex-row items-center justify-between border-b-2 border-gray-500 px-7 py-5 transition-all hover:bg-white/20">
          <Link href={`/tools/list-members/${list.listId}`}>
            <a key={list.listId}>
              <div className="flex flex-1 flex-col gap-[10px]">
                <h1 className="text-xl font-bold">
                  {list.name || list.listId}
                </h1>
                <span className="text-base font-bold text-gray-500">
                  &nbsp; {list.count} members
                </span>
              </div>
            </a>
          </Link>
          {list.type === ListDtoTypeEnum.Normal ? (
            <Button
              onClick={async () => {
                const api = new ListApi()
                await api
                  .deleteList({ listId: list.listId })
                  .catch((error) => toast(error))
                if (removable) {
                  setRemoved(true)
                }
              }}
              className="flex h-[45px] w-[45px] items-center  justify-center !rounded-[50%] bg-[#fffeff26]"
            >
              <DeleteIcon />
            </Button>
          ) : (
            <div className="flex h-[45px] w-[45px] items-center  justify-center">
              <IconTooltip
                tooltipText="Automatic list"
                Icon={AlertIcon}
                position="top"
                tooltipClassName="w-[100px]"
              />
            </div>
          )}
        </li>
      )}
    </>
  )
}
