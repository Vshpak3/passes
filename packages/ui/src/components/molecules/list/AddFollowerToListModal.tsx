import classNames from "classnames"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import React, { FC } from "react"

import { Button } from "src/components/atoms/Button"
import { ProfileWidget } from "src/components/molecules/ProfileWidget"
import { Modal, ModalProps } from "src/components/organisms/Modal"
import { useFollowerSearch } from "src/hooks/search/useFollowerSearch"

interface AddFollowerToListModalProps extends ModalProps {
  onSubmit(userId: string): void
  listId: string
}

const AddFollowerToListModal: FC<AddFollowerToListModalProps> = ({
  onSubmit,
  setOpen,
  listId,
  ...rest
}) => {
  const { results, searchValue, onChangeInput, searchRef, setResults } =
    useFollowerSearch(listId)

  return (
    <Modal setOpen={setOpen} {...rest} childrenClassname="w-[692px]">
      <span className="absolute top-[20px]">Add Users to the List</span>

      <div className="relative flex flex-col pt-[18px]">
        <div className="relative flex items-center gap-3">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2" />
          <input
            autoComplete="off"
            className="form-input h-[51px] w-full rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 xs:min-w-[320px] sm:min-w-[360px]"
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
            className="flex items-center justify-between py-3"
            key={user.userId}
          >
            <ProfileWidget user={user} />
            <span
              className="ml-3 cursor-pointer text-base font-medium leading-6 text-white transition-all"
              onClick={() => {
                onSubmit(user.userId)
                setResults((results) =>
                  results.filter((result) => result.userId !== user.userId)
                )
              }}
            >
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
              "bg-[#C943A8] !py-[10px] !px-[18px] font-bold text-[#ffffff]"
            )}
            onClick={() => setOpen(false)}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export { AddFollowerToListModal }
