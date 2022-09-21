import EditIcon from "public/icons/edit.svg"
import React from "react"
import { Alert, Button } from "src/components/atoms"
import { AddBankForm } from "src/components/organisms"

import Tab from "../../../Tab"

const AddBank = () => {
  return (
    <Tab title="Add Bank" withBack>
      <div className="mt-9 px-[30px]">
        <h5 className="text-base font-medium leading-[22px] text-white/50">
          Banking information
        </h5>
        <div className="mt-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-label">To download W9 form</h4>
            <Button variant="gray" className="!py-2.5 !px-8">
              <span className="text-label">Download W9 Form</span>
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="relative flex items-center space-x-1.5">
              <h4 className="text-label">To edit W9 form</h4>
              <div className="relative h-4 w-4">
                <Alert
                  message="Please, mannually fill out the W9 Form, and upload filled out W9 Form here."
                  messageClassName="absolute top-full left-1/2 w-[247px] translate-y-[13px] -translate-x-1/2 rounded-lg bg-[#2A242B] px-3 py-2 text-center text-xs font-medium text-white"
                  tooltipClassName="bottom-auto -top-1.5"
                />
              </div>
            </div>
            <Button
              variant="gray"
              className="!py-2.5 !px-8"
              icon={<EditIcon />}
            >
              <span className="text-label">Edit W9 Form</span>
            </Button>
          </div>
        </div>

        <AddBankForm />
      </div>
    </Tab>
  )
}

export default AddBank
