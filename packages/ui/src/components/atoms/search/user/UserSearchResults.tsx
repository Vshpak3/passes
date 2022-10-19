import { Combobox } from "@headlessui/react"
import { UserDisplayInfoDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, Fragment } from "react"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatText } from "src/helpers/formatters"

interface EmptyResultProps {
  text: string
}

export const EmptyResult: React.FC<EmptyResultProps> = ({ text }) => (
  <Combobox.Option value="placeholder" disabled>
    <li className="my-4 pl-6 text-[#ffffff]/30">
      <div>Search for {formatText(text)}</div>
    </li>
  </Combobox.Option>
)

type SearchResultProps = UserDisplayInfoDto

export const SearchResult: FC<SearchResultProps> = ({
  userId,
  displayName,
  username
}) => {
  const formattedUsername = `@${username}`

  return (
    <Combobox.Option key={userId} value={username} as={Fragment}>
      {({ active }) => (
        <li
          className={classNames(
            "grid cursor-pointer grid-flow-col grid-rows-2 place-content-start gap-0 py-3 text-[#ffffff]/90 hover:bg-[#1b141d]/90",
            { "bg-[#1b141d]/90": active }
          )}
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
            <div className="text-[12px] text-[#ffffff]/60">
              {formattedUsername}
            </div>
          </div>
        </li>
      )}
    </Combobox.Option>
  )
}
