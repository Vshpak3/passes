import { UserDisplayInfoDto } from "@passes/api-client"
import classNames from "classnames"
import { FC } from "react"

import { EmptyResult, SearchResult } from "./UserSearchResults"

interface UserSearchDropdownProps {
  results: UserDisplayInfoDto[]
  isDesktop?: boolean
  emptyText: string
  onClick: (user: UserDisplayInfoDto) => void | Promise<void>
}

export const UserSearchDropdown: FC<UserSearchDropdownProps> = ({
  results,
  isDesktop = true,
  emptyText,
  onClick
}) => {
  const resultsExist = results?.length > 0
  const renderResults = resultsExist ? (
    results.map((user: UserDisplayInfoDto) => (
      <SearchResult
        key={user.userId}
        userId={user.userId}
        displayName={user?.displayName ?? ""}
        username={user.username}
        onClick={async () => await onClick(user)}
      />
    ))
  ) : (
    <EmptyResult text={emptyText} />
  )

  return (
    <div
      className={classNames(
        isDesktop ? "hidden md:flex" : "",
        "items-center justify-end gap-2"
      )}
    >
      <div
        className={
          isDesktop
            ? "relative flex items-center gap-3"
            : "absolute top-16 w-full pr-2 xs:right-2 xs:w-auto xs:pr-0"
        }
      >
        <ul
          className={
            (classNames(isDesktop ? "max-h-[165px]" : "h-full w-full"),
            "z-10 overflow-y-auto rounded-md border border-[#ffffff]/10 bg-[#1b141d]/80 outline-none  xs:min-w-[320px] sm:min-w-[360px]")
          }
        >
          {renderResults}
        </ul>
      </div>
    </div>
  )
}
