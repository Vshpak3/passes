import { FC } from "react"

import { PassSearchBar } from "./PassesHoldingsSearch"

interface PassSearchHeaderProps {
  onSearchPass: unknown
  passSearchTerm: unknown
  headerTitle?: string
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PassSearchHeader: FC<PassSearchHeaderProps> = ({
  onSearchPass,
  passSearchTerm,
  headerTitle = "My Passes"
}) => {
  return (
    <div className="mx-auto mb-[70px] mt-[-180px] flex w-full items-center justify-center px-2 md:px-5 lg:mt-[-150px]">
      <div className="text-[24px] font-bold text-white">{headerTitle}</div>
      <PassSearchBar onChange={onSearchPass} passSearchTerm={passSearchTerm} />
    </div>
  )
}
