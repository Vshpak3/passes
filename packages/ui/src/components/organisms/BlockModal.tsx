import { RadioGroup } from "@headlessui/react"
import { FollowApi } from "@passes/api-client"
import Link from "next/link"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/button/Button"
import { Text } from "src/components/atoms/Text"
import { errorMessage } from "src/helpers/error"
import { Modal } from "./Modal"

const BLOCKED_USER_LIST_PAGE = "/settings/privacy/safety/blocked"

export interface BlockModalData {
  userId: string
  username: string
}

interface BlockModalProps {
  blockData: BlockModalData
  setBlockData: Dispatch<SetStateAction<BlockModalData | null>>
}

const BlockModal: FC<BlockModalProps> = ({ blockData, setBlockData }) => {
  const [blockValue, setBlockValue] = useState()

  const { userId, username } = blockData

  const onFanBlock = async () => {
    // TODO: this block value is not actually used
    if (!blockValue) {
      return
    }
    try {
      const api = new FollowApi()
      await api.blockFollower({ followerId: userId })
      setBlockData(null)

      toast.success(
        <div>
          <Link href={BLOCKED_USER_LIST_PAGE}>
            Successfully blocked this user. Click here to visit your settings to
            manage blocked users.
          </Link>
        </div>
      )
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  return (
    <Modal isOpen setOpen={() => setBlockData(null)}>
      <h2 className="mb-5 font-[500] text-white">BLOCK {username}</h2>
      <RadioGroup
        className="flex flex-col gap-4"
        onChange={setBlockValue}
        value={blockValue}
      >
        <RadioGroup.Option value="block">
          {({ checked }) => (
            <div className="flex cursor-pointer items-center gap-2">
              <input
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
                readOnly
                type="radio"
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
                checked={checked}
                className="h-6 w-6 cursor-pointer checked:bg-[#BF7AF0]"
                readOnly
                type="radio"
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
        <Button onClick={() => setBlockData(null)}>
          <Text className="text-white">Cancel</Text>
        </Button>
        <Button
          disabled={!blockValue}
          disabledClass="opacity-[0.5]"
          onClick={onFanBlock}
        >
          <Text className="text-white">Confirm</Text>
        </Button>
      </div>
    </Modal>
  )
}

export default BlockModal // eslint-disable-line import/no-default-export
