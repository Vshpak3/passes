import { Popover } from "@mui/material"
import classNames from "classnames"
import Image from "next/image"
import EditIcon from "public/icons/edit-icon.svg"
import React, { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"

interface UpdateListNamePopperProps {
  onSubmit(listName: string): Promise<void>
  value: string
}

const UpdateListNamePopper: FC<UpdateListNamePopperProps> = ({
  onSubmit,
  value
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [listName, setListName] = useState<string>(value)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value)
  }
  return (
    <>
      <span className="cursor-pointer" onClick={handleClick}>
        <EditIcon />
      </span>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        classes={{
          paper:
            "!bg-[#12070E] p-[24px] border border-[#ffffff26] w-[273px] flex flex-col text-white !rounded-[25px] "
        }}
        id={id}
        onClose={handleClose}
        open={open}
        sx={{
          padding: 0,
          border: 0,
          background: "transparent"
        }}
      >
        <div className="flex flex-row items-center justify-between">
          <span className="font-bold text-white">Edit List Name</span>
          <div className="relative text-right">
            <button
              className="inline-flex items-center rounded-[15px] bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="popup-modal"
              onClick={handleClose}
              type="button"
            >
              <Image
                alt="Close button"
                height={20}
                src="/icons/exit-icon.svg"
                width={20}
              />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>

        <div className="relative flex flex-col pt-[10px]">
          <input
            className="rounded-[6px] border border-[#2C282D] bg-[#100C11] p-[10px] text-white"
            onChange={handleChange}
            placeholder="Enter List Name"
            value={listName}
          />
          <div className="mt-[20px] flex flex-row justify-end gap-[10px]">
            <Button
              className="bg-[#c943a81a] !py-[10px] !px-[18px] font-bold text-[#C943A8]"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className={classNames(
                "bg-[#C943A8] !py-[10px] !px-[18px] font-bold text-[#ffffff]",
                {
                  "!text-[#ffffffeb]": listName === ""
                }
              )}
              disabled={listName === ""}
              onClick={async () => {
                await onSubmit(listName)
                handleClose()
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Popover>
    </>
  )
}

export { UpdateListNamePopper }
