import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useState } from "react"

import { creditCardIcons } from "../../helpers/creditCardIcon"
import { FormInput } from "../atoms"
import { PaymentModalInfo } from "../pages/profile/passes"
import { TipPostButton } from "../payment/tip-post"
import Modal from "./Modal"

interface IQuickPayModal {
  isOpen: PaymentModalInfo | null
  setOpen: Dispatch<SetStateAction<PaymentModalInfo | null>>
  postId: string
}

const TipsModal = ({
  isOpen = null,
  setOpen,
  postId
}: // passData
IQuickPayModal) => {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [errors, setErrors] = useState({})

  function validateAmount(submit: any) {
    if (amount.length === 0) {
      setErrors({
        amount: {
          message: "Please provide an amount to be tipped"
        }
      })

      return
    }

    if (parseInt(amount) < 5) {
      setErrors({
        amount: {
          message: "Tips have a minimum value of $5"
        }
      })

      return
    }

    submit()
  }

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        {}
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Tip post
        </span>
      </div>
      <div>
        <div className="my-4">
          <span className="text-[#ffff]/70">
            How much would you like to tip?
          </span>
          <FormInput
            register={() => ({
              onChange: (e: any) => {
                setAmount(e.target.value)
                setErrors({})
              },
              value: amount
            })}
            errors={errors}
            name="amount"
            type="number"
            placeholder="Amount"
            className="mb-4 mt-4 border-[#b3bee799] border-opacity-80 bg-transparent ring-opacity-80 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]"
          />
        </div>

        <div className="my-4">
          <span className="text-[#ffff]/90">Pay with</span>
        </div>
        <div className="flex justify-evenly rounded border border-[#2C282D] bg-[#100C11] p-2 text-left text-[#ffff]/90">
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
        <TipPostButton
          onClick={validateAmount}
          postId={postId}
          amount={parseInt(amount)}
          onCompleted={() => {
            setAmount("0")
            setOpen(null)
          }}
        />
      </div>
    </Modal>
  )
}

export default TipsModal
