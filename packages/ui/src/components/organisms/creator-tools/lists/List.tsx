import { ListApi, ListDto, ListDtoTypeEnum } from "@passes/api-client"
import Link from "next/link"
import { FC, memo, useState } from "react"
import { toast } from "react-toastify"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { IconTooltip } from "src/components/atoms/IconTooltip"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { formatText } from "src/helpers/formatters"
import { AlertIcon } from "src/icons/AlertIcon"
import { DeleteIcon } from "src/icons/DeleteIcon"

interface ListProps {
  list: ListDto
  removable?: boolean
}

const ListUnmemo: FC<ListProps> = ({ list, removable }) => {
  const [removed, setRemoved] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  return (
    <>
      {!removed && (
        <>
          <li className="flex cursor-pointer flex-row items-center justify-between border-b-2 border-gray-500 px-7 py-5 transition-all hover:bg-white/20">
            <Link
              className="flex-1"
              href={`/tools/list-members/${list.listId}`}
              key={list.listId}
            >
              <div className="flex flex-1 flex-col gap-[10px]">
                <h1 className="whitespace-pre-wrap text-xl font-bold">
                  {formatText(list.name || list.listId)}
                </h1>
                <span className="text-base font-bold text-gray-500">
                  &nbsp; {list.count} members
                </span>
              </div>
            </Link>
            {list.type === ListDtoTypeEnum.Normal ? (
              <Button
                className="flex h-[40px] w-[40px] items-center justify-center !rounded-[50%] bg-[#fffeff26]"
                icon={<DeleteIcon />}
                onClick={() => setDeleteModalOpen(true)}
                variant={ButtonVariant.NONE}
              />
            ) : (
              <div className="flex h-[40px] w-[40px] items-center justify-center">
                <IconTooltip
                  icon={AlertIcon}
                  position="top"
                  tooltipClassName="w-[100px]"
                  tooltipText="Automatic list"
                />
              </div>
            )}
          </li>
          {deleteModalOpen && (
            <DeleteConfirmationModal
              isOpen
              onClose={() => setDeleteModalOpen(false)}
              onDelete={async () => {
                if (removable) {
                  const api = new ListApi()
                  await api
                    .deleteList({ listId: list.listId })
                    .catch((error) => toast.error(error))
                  setRemoved(true)
                }
              }}
            />
          )}
        </>
      )}
    </>
  )
}

export const List = memo(ListUnmemo)
