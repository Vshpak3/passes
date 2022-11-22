import classNames from "classnames"
import React, { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { Dialog } from "src/components/organisms/Dialog"

interface CreateNewListModalProps {
  onSubmit(listName: string): void
  setOpen: (value: boolean) => void
  isOpen: boolean
}

const CreateNewListModal: FC<CreateNewListModalProps> = ({
  onSubmit,
  setOpen,
  isOpen
}) => {
  const [listName, setListName] = useState<string>("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value)
  }
  return (
    <Dialog
      className="border border-white/10 bg-passes-black px-6 py-5 md:rounded-lg"
      onClose={() => setOpen(false)}
      open={isOpen}
    >
      <div className="w-full md:w-[400px]">
        <SectionTitle>Create New List</SectionTitle>
        <div className="relative flex flex-col pt-[18px]">
          <input
            className="rounded-[6px] border border-[#2C282D] bg-[#100C11] p-[10px] focus:border-passes-pink-100/80 focus:outline-none focus:ring-passes-pink-100/80"
            onChange={handleChange}
            placeholder="Enter List Name"
          />
          <div className="mt-[30px] flex flex-row justify-end gap-[20px]">
            <Button
              className="bg-[#c943a81a] !py-[10px] !px-[18px] font-bold text-[#C943A8]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className={classNames(
                "bg-[#C943A8] !py-[10px] !px-[18px] font-bold text-white",
                {
                  "!text-[#ffffffeb]": listName === ""
                }
              )}
              disabled={listName === ""}
              onClick={() => onSubmit(listName)}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export { CreateNewListModal }
