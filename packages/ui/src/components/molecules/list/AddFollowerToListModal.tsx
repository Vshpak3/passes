import { Avatar } from "@mui/material"
import classNames from "classnames"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import React from "react"
import { Button } from "src/components/atoms/Button"
import { Modal, ModalProps } from "src/components/organisms/Modal"
import { useFollowSearch } from "src/hooks/search/useFollowSearch"
import { CheckVerified } from "src/icons/check-verified"

interface AddFollowerToListModalProps extends ModalProps {
  onSubmit(listName: string): void
}

const AddFollowerToListModal = ({
  onSubmit,
  setOpen,
  ...rest
}: AddFollowerToListModalProps) => {
  const { results, searchValue, onChangeInput, onSearchFocus, searchRef } =
    useFollowSearch()

  return (
    <Modal setOpen={setOpen} {...rest} childrenClassname="w-[692px]">
      <span className="absolute top-[20px]">Add Users to the List</span>

      <div className="relative flex flex-col pt-[18px]">
        <div className="relative flex items-center gap-3">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
          <input
            type="search"
            name="search"
            id="search"
            onChange={onChangeInput}
            onFocus={onSearchFocus}
            value={searchValue}
            ref={searchRef}
            autoComplete="off"
            placeholder={"Find user"}
            className="form-input h-[51px] w-full rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 xs:min-w-[320px] sm:min-w-[360px]"
          />
        </div>
        {results.map((user) => (
          <div
            className="flex items-center justify-between py-3"
            key={user.userId}
          >
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute right-[-5px] bottom-[0px] z-20 h-[18px] w-[18px] overflow-hidden rounded-full">
                  <CheckVerified height={18} width={18} />
                </div>
                <Avatar
                  alt="Name"
                  className="h-[50px] w-[50px] rounded-full"
                  src="https://cdn1.vectorstock.com/i/1000x1000/32/10/young-man-avatar-character-vector-14213210.jpg"
                />
              </div>
              <span className="ml-3 text-base font-medium leading-6 text-white">
                {user.username}
              </span>
            </div>
            <span
              className="duration-400 hover:text-passes-red-100 ml-3 cursor-pointer text-base font-medium leading-6 text-white transition-all"
              onClick={() => onSubmit(user.userId)}
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
