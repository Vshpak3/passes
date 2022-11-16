import { ListMemberDto } from "@passes/api-client"
import classNames from "classnames"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import React, { FC } from "react"

import { Button } from "src/components/atoms/button/Button"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import { Dialog } from "src/components/organisms/Dialog"
import { useFollowerSearch } from "src/hooks/search/useFollowerSearch"

interface AddFollowerToListModalProps {
  onSubmit(user: ListMemberDto): void
  listId: string
  setOpen: (value: boolean) => void
  isOpen: boolean
}

const AddFollowerToListModal: FC<AddFollowerToListModalProps> = ({
  onSubmit,
  setOpen,
  listId,
  isOpen
}) => {
  const { results, searchValue, onChangeInput, searchRef, setSearchValue } =
    useFollowerSearch(listId)

  return (
    <Dialog
      className="border border-white/10 bg-[#0c0609] px-6 py-5 md:rounded-[15px]"
      onClose={() => setOpen(false)}
      open={isOpen}
    >
      <SectionTitle>Add Users to the List</SectionTitle>
      <div className="relative flex flex-col pt-[18px]">
        <div className="relative flex items-center gap-3">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2" />
          <input
            autoComplete="off"
            className="form-input h-[51px] w-full rounded-md border border-white/10 bg-[#12070E]/50 pl-11 text-white outline-none placeholder:text-[16px] placeholder:text-white/30 focus:border-white/10  xs:min-w-[320px] sm:min-w-[360px]"
            id="search"
            name="search"
            onChange={onChangeInput}
            placeholder="Find user"
            ref={searchRef}
            type="search"
            value={searchValue}
          />
        </div>
        {results.map((user) => (
          <div
            className="flex items-center justify-between py-3 hover:cursor-pointer"
            key={user.userId}
            onClick={() => {
              onSubmit(user)
              setSearchValue("")
            }}
          >
            <ProfileWidget linked={false} user={user} />
            <span className="ml-3 cursor-pointer text-base font-medium leading-6 text-white transition-all">
              add
            </span>
          </div>
        ))}

        <div className="mt-[30px] flex flex-row justify-end gap-[20px]">
          <Button
            className="bg-[#c943a81a] !py-[10px] !px-[18px] font-bold text-[#C943A8]"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={classNames(
              "bg-[#C943A8] !py-[10px] !px-[18px] font-bold text-white"
            )}
            onClick={() => setOpen(false)}
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

export { AddFollowerToListModal }
