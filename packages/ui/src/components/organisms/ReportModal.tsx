import { RadioGroup } from "@headlessui/react"
import { FollowApi } from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/button/Button"
import { Text } from "src/components/atoms/Text"
import { errorMessage } from "src/helpers/error"
import { Modal } from "./Modal"

export interface ReportModalData {
  userId: string
  username: string
}

interface ReportModalProps {
  reportData: ReportModalData
  setReportData: Dispatch<SetStateAction<ReportModalData | null>>
}

const ReportModal: FC<ReportModalProps> = ({ reportData, setReportData }) => {
  const [reportValue, setReportValue] = useState()

  const { userId, username } = reportData

  const onFanReport = async () => {
    if (!reportValue) {
      return
    }
    try {
      const api = new FollowApi()
      await api.reportUser({
        reportUserDto: { reason: reportValue, userId }
      })
      toast.success("Reported this user")
      setReportData(null)
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  return (
    <Modal isOpen setOpen={() => setReportData(null)}>
      <h2 className="mb-5 font-[500] text-white">REPORT @{username}</h2>
      <RadioGroup
        className="flex flex-col gap-4"
        onChange={setReportValue}
        value={reportValue}
      >
        <RadioGroup.Option value="offensive">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
                readOnly
                type="radio"
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
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
                readOnly
                type="radio"
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
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
                readOnly
                type="radio"
              />
              <Text className="text-white">This content is spam</Text>
            </div>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="abuse">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
                readOnly
                type="radio"
              />
              <Text className="text-white">Report abuse</Text>
            </div>
          )}
        </RadioGroup.Option>
      </RadioGroup>
      <div className="flex justify-end gap-4">
        <Button onClick={() => setReportData(null)}>
          <Text className="text-white">Cancel</Text>
        </Button>
        <Button
          disabled={!reportValue}
          disabledClass="opacity-[0.5]"
          onClick={onFanReport}
        >
          <Text className="text-white">Report</Text>
        </Button>
      </div>
    </Modal>
  )
}

export default ReportModal // eslint-disable-line import/no-default-export
