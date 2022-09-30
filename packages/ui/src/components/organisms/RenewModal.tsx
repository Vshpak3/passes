import {
  GetPayinMethodResponseDtoMethodEnum,
  PassDto
} from "@passes/api-client"
import { useRouter } from "next/router"
import WalletIcon from "public/icons/wallet.svg"
import React, { Dispatch, SetStateAction, useEffect } from "react"
import { toast } from "react-toastify"
import { Button, PassesPinkButton } from "src/components/atoms"
import { PaymentModalInfo } from "src/components/pages/profile/passes/PassTypes"
import { paymentMethodConfig } from "src/helpers/payment/paymentMethodConfig"
import { usePayment } from "src/hooks"

import Modal from "./Modal"

interface RenewModalProps {
  isOpen: boolean
  passInfo: PaymentModalInfo | null
  setOpen: Dispatch<SetStateAction<boolean>>
  externalPasses: PassDto[]
}

const RenewModal = ({
  passInfo,
  setOpen,
  isOpen,
  externalPasses
}: RenewModalProps) => {
  const router = useRouter()
  const { defaultPayinMethod, cardInfo, getCardInfo } = usePayment()

  useEffect(() => {
    if (
      defaultPayinMethod &&
      defaultPayinMethod.cardId &&
      defaultPayinMethod.method ===
        GetPayinMethodResponseDtoMethodEnum.CircleCard
    ) {
      getCardInfo(defaultPayinMethod.cardId).catch(({ message }) => {
        console.error(message)
        toast.error(message)
      })
    }
  }, [defaultPayinMethod, getCardInfo])

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-[544px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Renew {passInfo?.title}
        </span>
        <span className="text-white">
          ${passInfo?.price?.toFixed(2)} /month
        </span>
      </div>
      <div>
        <div>
          <span className="text-[#ffff]/90">
            This content will be unlocked and available in the feed after
            purchase.
          </span>
        </div>
        {defaultPayinMethod &&
          paymentMethodConfig(defaultPayinMethod.method, cardInfo)}
        <div className="my-4">
          <span className="text-[#ffff]/90">
            Want to update your default payment method or add a new one?
          </span>{" "}
          <span
            className="cursor-pointer text-[#ffff]/90 underline"
            onClick={() => router.push("/settings")}
          >
            Settings
          </span>
          {externalPasses.length && (
            <div>
              <span className="mt-[12px] block text-[16px] font-bold text-[#ffff]/90">
                or <br />
                <span className="my-[12px] block">Verify Whitelisted NFT</span>
              </span>
              <div>
                <Button variant="purple">
                  <WalletIcon />
                  Verify your NFT
                </Button>
              </div>
            </div>
          )}
        </div>
        <PassesPinkButton
          isDisabled={
            defaultPayinMethod &&
            defaultPayinMethod.method ===
              GetPayinMethodResponseDtoMethodEnum.None
          }
          name="Renew Pass"
        />
      </div>
    </Modal>
  )
}

export default RenewModal
