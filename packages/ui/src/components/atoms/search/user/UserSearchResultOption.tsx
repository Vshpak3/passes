import { Combobox } from "@headlessui/react"
import { UserDisplayInfoDto } from "@passes/api-client"
import { FC } from "react"

import { UserSearchResult } from "./UserSearchResults"

type UserSearchResultOptionProps = UserDisplayInfoDto

export const UserSearchResultOption: FC<UserSearchResultOptionProps> = ({
  userId,
  displayName,
  username
}) => {
  return (
    <Combobox.Option key={userId} value={username}>
      {({ active, disabled }) => (
        <UserSearchResult
          active={active}
          disabled={disabled}
          displayName={displayName}
          userId={userId}
          username={username}
        />
      )}
    </Combobox.Option>
  )
}
