import { Combobox } from "@headlessui/react"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import React, { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { Dialog } from "src/components/organisms"
import { List } from "src/components/organisms/DirectMessage"

interface IListsDropdown {
  selectedLists: List[]
  lists: List[]
  onSaveLists: (lists: List[]) => void
  listDropdownVisible: boolean
  setListDropdownVisible: Dispatch<SetStateAction<any>>
}
export const MessagesListsDropdownDialog = ({
  selectedLists,
  lists,
  onSaveLists,
  listDropdownVisible,
  setListDropdownVisible
}: IListsDropdown) => {
  const [query, setQuery] = useState("")
  const [_selectedLists, _setSelectedLists] = useState<List[]>(selectedLists)

  const _onSelectList = (list: List) => {
    const listExists = _selectedLists.find(
      (existingList) => existingList?.listId === list.listId
    )
    if (listExists === undefined) {
      const updatedList = [..._selectedLists, list]
      _setSelectedLists(updatedList)
    }
  }
  const { register } = useForm({
    defaultValues: {}
  })
  const filteredLists =
    query === ""
      ? lists
      : lists.filter((list) => {
          return list?.name.toLowerCase().includes(query?.toLowerCase())
        })
  const groupedLists = filteredLists.reduce(
    (acc: { [key: string]: any[] }, list) => {
      if (!acc[list.type]) {
        acc[list.type] = []
      }
      acc[list.type].push(list)
      return acc
    },
    {}
  )
  return (
    <Combobox as="div">
      <Dialog
        className="flex h-[548px] w-[338px] transform flex-col items-center justify-center border border-[#ffffff]/10 bg-[#1B141D] px-[24px] py-5 backdrop-blur-[25px] transition-all md:max-w-[544px] md:rounded-[20px]"
        open={listDropdownVisible}
        title={
          <div className="mx-auto w-full pb-6 sidebar-collapse:max-w-[1100px]">
            <div className="flex w-full justify-between">
              <Combobox.Label className="block pb-4 pl-2 text-[16px] font-medium leading-[22px] text-white">
                Select Audience
              </Combobox.Label>
              <CloseIcon
                className="cursor-pointer"
                onClick={() => setListDropdownVisible(false)}
              />
            </div>
            <Combobox.Input
              placeholder="Find Audience.."
              className="box-border flex w-full items-start justify-between gap-[10px] rounded-md border border-passes-dark-200 bg-transparent p-[10px] text-sm outline-0  ring-0 focus:border-passes-dark-200  focus:outline-none focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        }
        footer={
          <div className="relative flex h-full w-full justify-center pt-5">
            <button
              className="w-full rounded-[55px] bg-[#C943A8] py-2 px-6"
              type="button"
              onClick={() => onSaveLists(_selectedLists)}
            >
              Save
            </button>
          </div>
        }
      >
        <div className="mx-auto w-full sidebar-collapse:max-w-[1100px]">
          <div className="relative mt-1 w-full">
            {filteredLists.length > 0 && (
              <Combobox.Options
                static={listDropdownVisible}
                className="z-10 mt-1 box-border flex h-full w-full flex-col items-start justify-start gap-[20px] overflow-auto bg-transparent py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                {Object.keys(groupedLists).map((type) => (
                  <>
                    <Combobox.Option
                      key="pass-holders"
                      value="Pass holders"
                      className="cursor-pointer select-none text-left text-[14px] font-medium leading-[20px]  text-white"
                    >
                      <span>
                        {type === "normal" ? "Created Audience Lists" : type}
                      </span>
                    </Combobox.Option>
                    {groupedLists[type].map((list, index) => (
                      <Combobox.Option
                        key={index}
                        value={list}
                        className="relative w-full"
                      >
                        <FormInput
                          textPosition="Special"
                          register={register}
                          key={index}
                          name={`lists[${list.listId}]`}
                          type="checkbox"
                          options={{ onChange: () => _onSelectList(list) }}
                          label={list.name}
                          labelClassName="font-normal text-[16px] text-[#979797]"
                          className="h-4 w-4 rounded border border-[#D0D5DD] bg-black text-passes-primary-color ring-0 focus:shadow-none focus:ring-0 focus:ring-offset-0"
                        />
                      </Combobox.Option>
                    ))}
                  </>
                ))}
              </Combobox.Options>
            )}
          </div>
        </div>
      </Dialog>
    </Combobox>
  )
}
