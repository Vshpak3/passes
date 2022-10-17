import { RadioGroup } from "@headlessui/react"
import { FollowApi } from "@passes/api-client"
import { FC, useState } from "react"
import { Button } from "src/components/atoms/Button"
import { Text } from "src/components/atoms/Text"
import { errorMessage } from "src/helpers/error"

import { Modal, ModalProps } from "./Modal"

export const BlockModal: FC<ModalProps> = ({
  isOpen = false,
  setOpen,
  creatorId,
  username
}) => {
  const [blockValue, setBlockValue] = useState("")

  const onFanBlock = async () => {
    try {
      const api = new FollowApi()
      await api.blockFollower({ followerId: creatorId || "" })
      setOpen(false)
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <h2 className="mb-5 font-semibold text-white">BLOCK {username}</h2>
      <RadioGroup
        value={blockValue}
        onChange={setBlockValue}
        className="flex flex-col gap-4"
      >
        <RadioGroup.Option value="block">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                readOnly
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
              />
              <Text className="text-white">
                Block user from accessing your profile.
              </Text>
            </div>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="restrict">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                readOnly
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
              />
              <Text className="text-white">
                Restrict, user will not be able to send you direct messages or
                reply to your posts.
              </Text>
            </div>
          )}
        </RadioGroup.Option>
      </RadioGroup>

      <div className="mt-7 flex justify-end gap-4">
        <Button onClick={() => setOpen(false)} variant="">
          <Text className="text-white">Cancel</Text>
        </Button>
        <Button disabled={!blockValue} onClick={() => onFanBlock()} variant="">
          <Text className="text-white">Confirm</Text>
        </Button>
      </div>
    </Modal>
  )
}
