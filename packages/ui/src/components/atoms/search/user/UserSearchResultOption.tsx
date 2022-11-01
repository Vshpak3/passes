import { Combobox } from "@headlessui/react"
import { FC, Fragment } from "react"

import { UserSearchResult, UserSearchResultProps } from "./UserSearchResults"

type UserSearchResultOptionProps = Omit<UserSearchResultProps, "active">

export const UserSearchResultOption: FC<UserSearchResultOptionProps> = (
  props
) => {
  return (
    <Combobox.Option key={props.userId} value={props.username} as={Fragment}>
      {({ active }) => <UserSearchResult active={active} {...props} />}
    </Combobox.Option>
  )
}
