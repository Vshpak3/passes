import Link from "next/link"
import { FC, memo } from "react"

import { formatText } from "src/helpers/formatters"
import { PassListCachedProps } from "./PassListCached"

type PassListProps = PassListCachedProps

const PassListUnmemo: FC<PassListProps> = ({ pass }) => {
  const { passId, title, amountMinted } = pass
  return (
    <li className="flex cursor-pointer flex-row items-center justify-between border-b-2 border-gray-500 px-7 py-5 transition-all hover:bg-white/20">
      <Link
        className="flex-1"
        href={`/tools/pass-holders/${passId}`}
        key={passId}
      >
        <div className="flex flex-1 flex-col gap-[10px]">
          <h1 className="whitespace-pre-wrap text-xl font-bold">
            {formatText(title || passId)}
          </h1>
          <span className="text-base font-bold text-gray-500">
            &nbsp; {amountMinted} members
          </span>
        </div>
      </Link>
    </li>
  )
}

export const PassList = memo(PassListUnmemo)
