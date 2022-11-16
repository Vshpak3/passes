import classNames from "classnames"
import React, { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { Modal, ModalProps } from "src/components/organisms/Modal"

interface CreateNewListModalProps extends ModalProps {
  onSubmit(listName: string): void
}

const CreateNewListModal: FC<CreateNewListModalProps> = ({
  onSubmit,
  setOpen,
  ...rest
}) => {
  const [listName, setListName] = useState<string>("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value)
  }
  return (
    <Modal setOpen={setOpen} {...rest}>
      <span className="absolute top-[20px]">Create New List</span>
      <div className="relative flex flex-col pt-[18px]">
        <input
          className="rounded-[6px] border border-[#2C282D] bg-[#100C11] p-[10px]"
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
    </Modal>
  )
}

export { CreateNewListModal }
