import { ListApi, ListDto, ListDtoTypeEnum } from "@passes/api-client"
import Link from "next/link"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms/Button"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"

interface ListProps {
  list: ListDto
  removable?: boolean
}

export const List = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  list,
  removable
}: ListProps) => {
  const [removed, setRemoved] = useState<boolean>(false)
  return (
    <ConditionRendering condition={!removed}>
      <Link href={`/tools/list-members/${list.listId}`} key={list.listId}>
        <li className="duration-400 cursor-pointer border-b-2 border-gray-500 px-7 py-5 transition-all hover:bg-white/20">
          <h1 className="text-xl font-bold">{list.name || list.listId}</h1>
          <span className="text-base font-bold text-gray-500">
            &nbsp; {list.count}
          </span>

          <ConditionRendering condition={list.type === ListDtoTypeEnum.Normal}>
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
            >
              delete
            </Button>
          </ConditionRendering>
        </li>
      </Link>
    </ConditionRendering>
  )
}
