import { Combobox } from "@headlessui/react"
import { UserDisplayInfoDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, Fragment } from "react"

import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatText } from "src/helpers/formatters"

interface CustomResultProps {
  text: string
}

export const CustomResult: FC<CustomResultProps> = ({ text }) => (
  <Combobox.Option value="placeholder" disabled>
    <li className="my-4 pl-6 text-[#ffffff]/30">
      <div>{formatText(text)}</div>
    </li>
  </Combobox.Option>
)

type SearchResultOptionProps = Omit<SearchResultProps, "active">

export const SearchResultOption: FC<SearchResultOptionProps> = (props) => {
  return (
    <Combobox.Option key={props.userId} value={props.username} as={Fragment}>
      {({ active }) => <UserSearchResult active={active} {...props} />}
    </Combobox.Option>
  )
}

interface SearchResultProps extends UserDisplayInfoDto {
  active: boolean
  disabled?: boolean
  onSelect?: (value: string) => void
}

export const UserSearchResult: FC<SearchResultProps> = ({
  userId,
  displayName,
  username,
  active,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelect = () => {}
}) => {
  const formattedUsername = `@${username}`

  return (
    <li
      className={classNames(
        "grid cursor-pointer grid-flow-col grid-rows-2 place-content-start gap-0 py-3 pr-4 text-[#ffffff]/90",
        { "bg-[#1b141d]/90": active },
        { " hover:bg-[#1b141d]/90": !disabled },
        { "bg-[#1b141d]/100": disabled },
        { "cursor-not-allowed": disabled }
      )}
      onClick={() => {
        if (disabled) {
          return
        }

        onSelect(username)
      }}
    >
      <div className="col-span-1 row-span-2 flex w-[75px] items-center justify-center">
        <div className="col-span-1 row-span-2 flex w-[75px] items-center justify-center">
          <ProfileThumbnail userId={userId} />
        </div>
      </div>
      <div className="col-start-2 row-span-2 w-full content-start">
        {displayName && (
          <div className="text-[16px] font-medium">{displayName}</div>
        )}
        <div className="text-[12px] text-[#ffffff]/60">{formattedUsername}</div>
      </div>
    </li>
  )
}
