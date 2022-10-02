import { Combobox } from "@headlessui/react"
import { ListMemberDto } from "@passes/api-client"
import classNames from "classnames"
import ChevronDown from "public/icons/header-chevron-down-icon.svg"
import { useState } from "react"
import { useFollowSearch } from "src/hooks"

interface ISearchInputDropdown {
  onUserSelect: (user: ListMemberDto) => void
}

export const ChannelSearchInput = ({ onUserSelect }: ISearchInputDropdown) => {
  const { onChangeInput, following } = useFollowSearch()
  const [selectedUser, setSelectedUser] = useState<ListMemberDto>()
  return (
    <Combobox
      as="div"
      value={selectedUser}
      onChange={(user: ListMemberDto) => {
        setSelectedUser(user)
        onUserSelect(user)
      }}
    >
      <div className="relative mt-1">
        <Combobox.Input
          placeholder="Search people.."
          className="box-border flex w-full items-start justify-between gap-[10px] rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px] text-sm outline-0  ring-0 focus:border-passes-dark-200  focus:outline-none focus:ring-0"
          onChange={onChangeInput}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDown className="child:stroke-[#767676]" />
        </Combobox.Button>

        {following.length > 0 && (
          <Combobox.Options
            className="absolute top-14 z-10 mt-1 box-border  flex max-h-60 w-full flex-col items-start justify-start gap-[10px] overflow-auto
         rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
          "
          >
            {following.map((user) => (
              <Combobox.Option
                key={user.userId}
                value={user}
                className={({ active }) =>
                  classNames(
                    "relative  w-full cursor-pointer select-none py-2 pl-3 pr-9",
                    active ? " bg-gray-100/10" : "text-white"
                  )
                }
              >
                <>
                  <div className="flex items-center">
                    {/* <span
                      className={classNames(
                        "inline-block h-2 w-2 flex-shrink-0 rounded-full",
                        user.online ? "bg-green-400" : "bg-gray-200"
                      )}
                      aria-hidden="true"
                    /> */}
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                      className="ml-2 h-6 w-6 flex-shrink-0 rounded-full"
                    />
                    <span className="ml-2 truncate">
                      {user.displayName ?? user.username}
                      {/* <span className="sr-only">
                        is {user.online ? "online" : "offline"}
                      </span> */}
                    </span>
                  </div>
                </>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
