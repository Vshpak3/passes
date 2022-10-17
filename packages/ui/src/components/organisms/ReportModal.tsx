import { RadioGroup } from "@headlessui/react"
import { FollowApi } from "@passes/api-client"
import { FC, useState } from "react"
import { Button } from "src/components/atoms/Button"
import { Text } from "src/components/atoms/Text"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"

import { Modal, ModalProps } from "./Modal"

export const ReportModal: FC<ModalProps> = ({ isOpen = false, setOpen }) => {
  const { user } = useUser()

  const [reportValue, setReportValue] = useState("")

  const onFanReport = async () => {
    try {
      const api = new FollowApi()
      await api.reportUser({
        reportUserDto: { reason: reportValue, userId: user?.userId || "" }
      })
      setOpen(false)
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <h2 className="mb-5 font-semibold text-white">REPORT USER</h2>
      <RadioGroup
        value={reportValue}
        onChange={setReportValue}
        className="flex flex-col gap-4"
      >
        <RadioGroup.Option value="offensive">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                readOnly
                type="radio"
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
              />
              <Text className="text-white">
                This content is offensive or violates &quot;Passes&quot; Terms
                of Service
              </Text>
            </div>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="dmca">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                readOnly
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
              />
              <Text className="text-white">
                This content contains stolen material (DMCA)
              </Text>
            </div>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="spam">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                checked={checked}
                readOnly
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
              />
              <Text className="text-white">This content is spam</Text>
            </div>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="abuse">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                checked={checked}
                readOnly
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
              />
              <Text className="text-white">Report abuse</Text>
            </div>
          )}
        </RadioGroup.Option>
      </RadioGroup>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setOpen(false)} variant="">
          <Text className="text-white">Cancel</Text>
        </Button>
        <Button
          disabled={!reportValue}
          onClick={() => onFanReport()}
          variant=""
        >
          <Text className="text-white">Report</Text>
        </Button>
      </div>
    </Modal>
  )
}
