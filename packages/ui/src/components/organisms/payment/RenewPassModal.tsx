import {
  GetPayinMethodResponseDtoMethodEnum,
  PassHolderDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"

import { Button } from "src/components/atoms/button/Button"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { getPassType } from "src/components/molecules/pass/PassCard"
import { PayinMethodDisplay } from "src/components/molecules/payment/PayinMethodDisplay"
import { RenewPassButton } from "src/components/molecules/payment/RenewPassButton"
import { Modal } from "src/components/organisms/Modal"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface RenewPassModalProps {
  passHolder: PassHolderDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RenewPassModal: FC<RenewPassModalProps> = ({
  passHolder,
  setOpen,
  isOpen
}) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()

  const {
    creatorId,
    creatorDisplayName,
    creatorUsername,
    title,
    description,
    totalMessages,
    price,
    type,
    passHolderId
  } = passHolder

  return (
    <Modal
      closable={false}
      isOpen={isOpen}
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={setOpen}
    >
      <div className="mb-4">
        <SectionTitle className="mt-0">Renew Pass</SectionTitle>
        <div className="mb-4 flex items-center border-b border-passes-gray-600 pt-2 pb-6">
          {creatorId && <ProfileImage type="thumbnail" userId={creatorId} />}
          <div className="ml-4 flex flex-col">
            <span>{creatorDisplayName}</span>
            <span className="text-passes-dark-gray">@{creatorUsername}</span>
          </div>
        </div>
        <div className="flex justify-center rounded bg-gradient-to-r from-[#46165E] to-passes-tertiary-color py-2 font-bold">
          {title}
        </div>
        <div className="my-4 text-passes-dark-gray">{description}</div>
        <div className="flex flex-row justify-between">
          <span>
            <span className="mr-1 font-bold">
              {totalMessages ? totalMessages : "Unlimited"}
            </span>
            free messages
          </span>
          <span className="rounded-lg bg-passes-primary-color/30 px-2 py-1 font-bold">
            ${price}
            <span className="px-1">/</span>
            {getPassType(type)}
          </span>
        </div>
      </div>
      <div>
        {defaultPayinMethod && (
          <PayinMethodDisplay
            card={defaultCard}
            closeModal={() => setOpen(false)}
            payinMethod={defaultPayinMethod}
          />
        )}
      </div>
      <div className="flex w-full items-center justify-end">
        <Button
          className="mr-8 font-bold text-passes-primary-color"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <RenewPassButton
          isDisabled={
            !defaultPayinMethod ||
            defaultPayinMethod.method ===
              GetPayinMethodResponseDtoMethodEnum.None
          }
          onSuccess={() => setOpen(false)}
          passHolderId={passHolderId}
        />
      </div>
    </Modal>
  )
}
