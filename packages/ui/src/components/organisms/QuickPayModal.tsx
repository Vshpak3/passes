import { PassApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction } from "react"
import { toast } from "react-toastify"
import { PassesPinkButton } from "src/components/atoms"
import { PaymentModalInfo } from "src/components/pages/profile/passes/PassTypes"
import { BuyPassButton } from "src/components/payment/buy-pass"
import { creditCardIcons } from "src/helpers/creditCardIcon"
import { usePayinMethod, useUser } from "src/hooks"

import Modal from "./Modal"

interface IQuickPayModal {
  isOpen: PaymentModalInfo | null
  setOpen: Dispatch<SetStateAction<PaymentModalInfo | null>>
  //product TODO: support posts and passes
}

const QuickPayModal = ({
  isOpen = null,
  setOpen
}: // passData
IQuickPayModal) => {
  const router = useRouter()
  const { user } = useUser()
  const { defaultPayinMethod } = usePayinMethod()

  const handlePayment = async () => {
    const passApi = new PassApi()
    if (user && isOpen) {
      const createPassHolderDto = {
        passId: isOpen && isOpen.passId,
        payinMethod: defaultPayinMethod
      }
      try {
        await passApi.registerBuyPass({
          createPassHolderRequestDto: createPassHolderDto
        })
      } catch (error: any) {
        console.error(error)
        toast.error(error)
      } finally {
        // await getDefaultPayin(paymentApi)
      }
    }
  }

  return (
    <Modal isOpen={Boolean(isOpen)} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        {}
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          {isOpen?.title}
        </span>
        <span className="text-white">${isOpen?.price?.toFixed(2)} /month</span>
      </div>
      <div>
        <div className="my-4">
          <span className="text-[#ffff]/70">4 videos, 10 photos</span>
        </div>
        <div>
          <span className="text-[#ffff]/90">
            This content will be unlocked and available in the feed after
            purchase.
          </span>
        </div>
        <div className="my-4">
          {/* <span className="text-[#ffff]/70">Frame 34242</span> */}
          <span className="text-[#ffff]/90">Pay with</span>
        </div>
        <div className="flex justify-evenly rounded border border-passes-dark-200 bg-[#100C11] p-2 text-left text-[#ffff]/90">
          {/* fake info here, needs to grab user default CC data to fill this out automatically */}
          <div className="flex flex-1 gap-4 justify-self-start">
            {creditCardIcons["mastercard"]}
            <span>• • • • ‏‏‎5678</span>
          </div>
          <div className="flex-1">
            <span>05/2027</span>
          </div>
        </div>
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
        </div>
        <BuyPassButton passId={isOpen?.passId as string} />
        <PassesPinkButton name="Confirm" onClick={handlePayment} />
      </div>
    </Modal>
  )
}

export default QuickPayModal
