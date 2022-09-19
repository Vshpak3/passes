import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"

// import { usePayment } from "src/hooks"
import { creditCardIcons } from "../../helpers/creditCardIcon"
import { BuyMessagesAmountDropdown } from "../molecules/direct-messages/buy-messages-amount-dropdown"
import { PaymentModalInfo } from "../pages/profile/passes/PassTypes"
import Modal from "./Modal"

interface IBuyMessagesModal {
  isOpen: PaymentModalInfo | null
  setOpen: Dispatch<SetStateAction<any>>
  freeMessages: number
  setFreeMessages: Dispatch<SetStateAction<any>>
}

const MOCK_AMOUNTS_MESSAGES = [10, 20, 30, 40, 100, 1000]

const BuyMessagesModal = ({
  isOpen = null,
  setOpen,
  freeMessages,
  setFreeMessages
}: IBuyMessagesModal) => {
  const router = useRouter()
  // const { defaultPayinMethod } = usePayment()
  const [messagesAmount, setMessagesAmount] = useState(0)

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="flex items-center justify-center gap-[6px]">
        <span className="text-xl font-bold text-white">Unlock</span>
        <span>
          <BuyMessagesAmountDropdown
            selectedAmount={messagesAmount}
            amounts={MOCK_AMOUNTS_MESSAGES}
            onSelectAmount={setMessagesAmount}
          />
        </span>
        <span className="text-xl font-bold text-white">more messages</span>
      </div>
      <div>
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
            onClick={() => router.push("/payment/default-payin-method")}
          >
            Settings
          </span>
        </div>
        {isOpen && (
          <button
            onClick={() => setFreeMessages(freeMessages + messagesAmount)}
            className="w-full rounded-[50px] bg-passes-pink-100 p-2 text-white"
            type="submit"
          >
            Confirm and Continue
          </button>
          // <BuyPostButton
          //   postId={isOpen?.passId as string}
          //   fromDM={false}
          //   payinMethod={defaultPayinMethod}
          //   onSuccess={() => setOpen(null)}
          // />
          // TODO: @Patrick we need BuyMessages Button as we have for send message
        )}
      </div>
    </Modal>
  )
}

export default BuyMessagesModal
