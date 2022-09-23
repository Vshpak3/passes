import { Combobox } from "@headlessui/react"
import ChevronDown from "public/icons/header-chevron-down-icon.svg"
import { useState } from "react"

import { classNames } from "../../../helpers"
import { Users } from "./ChannelList"

interface ISearchInputDropdown {
  users: Users[]
}

export const ChannelSearchInput = ({ users }: ISearchInputDropdown) => {
  const [query, setQuery] = useState("")
  const [selectedPerson, setSelectedPerson] = useState()
  // TODO: next step is channel callback for selectedPerson
  // should appear on message channel list with chat window active/open
  const filteredUsers =
    query === ""
      ? users
      : users.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
      <div className="relative mt-1">
        <Combobox.Input
          placeholder="Search people.."
          className="box-border flex w-full items-start justify-between gap-[10px] rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px] text-sm outline-0  ring-0 focus:border-passes-dark-200  focus:outline-none focus:ring-0"
          onChange={(event) => setQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronDown className="child:stroke-[#767676]" />
        </Combobox.Button>

        {filteredUsers.length > 0 && (
          <Combobox.Options
            className="absolute top-14 z-10 mt-1 box-border  flex max-h-60 w-full flex-col items-start justify-start gap-[10px] overflow-auto
         rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
          "
          >
            {filteredUsers.map((person) => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  classNames(
                    "relative  w-full cursor-pointer select-none py-2 pl-3 pr-9",
                    active ? " bg-gray-100/10" : "text-white"
                  )
                }
              >
                <>
                  <div className="flex items-center">
                    <span
                      className={classNames(
                        "inline-block h-2 w-2 flex-shrink-0 rounded-full",
                        person.online ? "bg-green-400" : "bg-gray-200"
                      )}
                      aria-hidden="true"
                    />
                    <img // eslint-disable-line @next/next/no-img-element
                      src={person.imageUrl}
                      alt=""
                      className="ml-2 h-6 w-6 flex-shrink-0 rounded-full"
                    />
                    <span className="ml-2 truncate">
                      {person.name}
                      <span className="sr-only">
                        is {person.online ? "online" : "offline"}
                      </span>
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
