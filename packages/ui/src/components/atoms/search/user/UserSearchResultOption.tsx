import { Combobox } from "@headlessui/react"
import { UserDisplayInfoDto } from "@passes/api-client"
import { FC } from "react"

import { UserSearchResult } from "./UserSearchResults"

type UserSearchResultOptionProps = UserDisplayInfoDto

export const UserSearchResultOption: FC<UserSearchResultOptionProps> = (
  props
) => {
  return (
    <Combobox.Option key={props.userId} value={props.username}>
      {({ active, disabled }) => (
        <UserSearchResult active={active} disabled={disabled} {...props} />
      )}
    </Combobox.Option>
  )
}
