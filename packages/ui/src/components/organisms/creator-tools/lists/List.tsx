import { ListApi, ListDto, ListDtoTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import Link from "next/link"
import { FC, memo, useState } from "react"
import { toast } from "react-toastify"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { IconTooltip } from "src/components/atoms/IconTooltip"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { formatText } from "src/helpers/formatters"
import { AlertIcon } from "src/icons/AlertIcon"
import { DeleteIcon } from "src/icons/DeleteIcon"
import { ListCachedProps } from "./ListCached"

interface ListProps extends ListCachedProps {
  list: ListDto
  removable?: boolean
  update: (update: Partial<ListDto>) => void
}

const ListUnmemo: FC<ListProps> = ({ list, removable, update }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const { deletedAt, listId, name, count, type } = list
  return (
    <li
      className={classNames(
        deletedAt && "hidden",
        "flex cursor-pointer flex-row items-center justify-between border-b-2 border-gray-500 px-7 py-5 transition-all hover:bg-white/20"
      )}
    >
      <Link
        className="flex-1"
        href={`/tools/list/list-members/${listId}`}
        key={listId}
      >
        <div className="flex flex-1 flex-col gap-[10px]">
          <h1 className="whitespace-pre-wrap text-xl font-bold">
            {formatText(name || listId)}
          </h1>
          <span className="text-base font-bold text-gray-500">
            &nbsp; {count} members
          </span>
        </div>
      </Link>
      {type === ListDtoTypeEnum.Normal ? (
        <Button
          className="flex h-[45px] w-[45px] items-center justify-center !rounded-[50%] bg-[#fffeff26]"
          onClick={() => setDeleteModalOpen(true)}
          variant={ButtonVariant.NONE}
        >
          <DeleteIcon className="h-[20px] w-[20px]" />
        </Button>
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
      {deleteModalOpen && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setDeleteModalOpen(false)}
          onDelete={async () => {
            if (removable) {
              const api = new ListApi()
              await api
                .deleteList({ listId: listId })
                .catch((error) => toast.error(error))
              update({ deletedAt: new Date() })
              toast.success("A list was deleted")
            }
          }}
        />
      )}
    </li>
  )
}

export const List = memo(ListUnmemo)
