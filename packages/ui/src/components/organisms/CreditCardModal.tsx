import { yupResolver } from "@hookform/resolvers/yup"
import {
  CircleEncryptionKeyDto,
  PayinMethodDto,
  PayinMethodDtoMethodEnum,
  PaymentApi
} from "@passes/api-client"
import { SHA256 } from "crypto-js"
import AmexIcon from "public/icons/amex-icon.svg"
import CoinbaseIcon from "public/icons/coinbase-icon.svg"
import DiscoverIcon from "public/icons/discover-icon.svg"
import MastercardIcon from "public/icons/mastercard-icon.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import TrelloIcon from "public/icons/trello-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import WalletConnectIcon from "public/icons/wallet-connect-icon.svg"
import React, { Dispatch, SetStateAction, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  ButtonTypeEnum,
  FormInput,
  PassesPinkButton
} from "src/components/atoms"
import { EIcon } from "src/components/atoms/Input"
import encrypt from "src/helpers/openpgp"
import { creditCardSchema } from "src/helpers/validation"
import { wrapApi } from "src/helpers/wrapApi"
import { useLocalStorage } from "src/hooks"
import { v4 } from "uuid"

import PayPage from "../../pages/payment/pay-button-example"
import Modal from "./Modal"

interface ICreditCardModal {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  defaultPayin: PayinMethodDto | undefined
}

const CreditCardModal = ({
  isOpen = false,
  setOpen,
  defaultPayin
}: ICreditCardModal) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
    // getValues,
    // setValue
  } = useForm({
    resolver: yupResolver(creditCardSchema)
  })
  const [accessToken] = useLocalStorage("access-token", "")
  console.log(defaultPayin)

  async function onSubmit(data: any) {
    console.log("submitted data", data)
    const idempotencyKey = v4()
    const cardDetails = {
      number: data.cardNumber.trim().replace(/\D/g, ""),
      cvv: data.cvv
    }

    const payload = {
      createCardDto: {
        idempotencyKey: idempotencyKey,
        keyId: "",
        encryptedData: "",
        billingDetails: {
          name: data.cardholderName,
          city: data.city,
          country: data.country,
          line1: data.billingAddress,
          line2: data.alternativeAddress,
          district: data.district,
          postalCode: data.postalCode
        },
        expMonth: parseInt(data.expiryMonth),
        expYear: parseInt(data.expiryYear),
        metadata: {
          sessionId: SHA256(accessToken).toString().substr(0, 50),
          ipAddress: "",
          phoneNumber: "+12025550180",
          email: data.email
        }
      },
      cardNumber: cardDetails.number
    }
    console.log("PAYLOAD", payload)
    const paymentApi = wrapApi(PaymentApi)

    const publicKey = await paymentApi.paymentGetCircleEncryptionKey()

    const encryptedData = await encrypt(
      cardDetails,
      publicKey as CircleEncryptionKeyDto
    )
    console.log(
      "🚀 ~ file: CreditCardModal.tsx ~ line 98 ~ onSubmit ~ encryptedData",
      encryptedData
    )

    const { encryptedMessage, keyId } = encryptedData

    payload.createCardDto.keyId = keyId
    payload.createCardDto.encryptedData = encryptedMessage

    //TODO: handle error on frontend (display some generic message)
    const createdCard = await paymentApi.paymentCreateCircleCard(
      { circleCreateCardAndExtraDto: payload },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        }
      }
    )

    setTimeout(async () => {
      const cardsResp = await paymentApi.paymentGetCircleCards({
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        }
      })
      const card = cardsResp.find((item) => item.id === createdCard.id)
      console.log(
        "🚀 ~ file: CreditCardModal.tsx ~ line 131 ~ setTimeout ~ card",
        card
      )
      console.log("whatsi n here2", createdCard)
      if (card && card.status === "complete") {
        // set here paymentSetDefaultPayinMethod
        await paymentApi.paymentSetDefaultPayinMethod(
          {
            payinMethodDto: {
              method: PayinMethodDtoMethodEnum.CircleCard,
              cardId: createdCard.id
            }
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json"
            }
          }
        )
      }
    }, 1000)
    // else lemao
  }

  // res.status === completed, then we can set
  // the default card to the newly created card

  useEffect(() => {
    console.log("🚀 ~ file: CreditCardModal.tsx ~ line 54 ~ errors", errors)
  }, [errors])

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      {/* <div className="flex flex-wrap gap-4"> */}
      {/* <Image src="www.google.ca" alt="test" width={200} height={50} /> */}
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e).catch((err) =>
            console.log(`errors: ${err}`)
          )
        }}
      >
        <div>
          <span className="text-[#ffff]/70">About your membership</span>
        </div>
        <div>
          <span className="font-semibold text-[#ffff]/90">
            No long-term commitment. Cancel anytime in your account settings.
            Plan will automatically renew until cancelled.
          </span>
        </div>
        <div className="align-center mx-auto my-4 flex w-[250px] justify-center">
          <div className="px-2">
            <MetamaskIcon />
          </div>
          <div className="px-2">
            <CoinbaseIcon />
          </div>
          <div className="px-2">
            <TrelloIcon />
          </div>
          <div className="px-2">
            <PhantomIcon />
          </div>
          <div className="px-2">
            <WalletConnectIcon />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-[#ffff]/90">or Pay with Credit card</span>
          <div>
            <span className="text-[#ffff]/70">Cardholder Name</span>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="cardholderName"
              placeholder="Name"
              className="m-0 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
          <div>
            <span className="text-[#ffff]/70">Card number</span>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="cardNumber"
              className="m-0 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              placeholder="0000 0000 0000 0000"
              mask={"9999 9999 9999 9999"}
              icon={
                <>
                  <AmexIcon />
                  <VisaIcon />
                  <MastercardIcon />
                  <DiscoverIcon />
                </>
              }
              iconAlign={EIcon.Right}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4">
          <div>
            <span className="text-[#ffff]/70">Month</span>
            <FormInput
              errors={errors}
              register={register}
              mask="99"
              type="text"
              name="expiryMonth"
              placeholder="MM"
              className="mb-4 max-w-[60px] border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
          <div>
            <span className="text-[#ffff]/70">Year</span>
            <FormInput
              errors={errors}
              register={register}
              mask="9999"
              type="text"
              name="expiryYear"
              placeholder="YYYY"
              className="mb-4 max-w-[75px] border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
          <div>
            <span className="text-[#ffff]/70">CVV</span>
            <FormInput
              errors={errors}
              register={register}
              mask="9999"
              type="text"
              name="cvv"
              placeholder="CVV"
              className="mb-4 max-w-[70px] border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
        </div>
        <div>
          <span className="text-[#ffff]/90">Billing address</span>
          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="billingAddress"
            placeholder="Street address"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
          />
          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="alternativeAddress"
            placeholder="Street address (optinal)"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
          />
          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="city"
            placeholder="City"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
          />
          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="country"
            placeholder="Country (2 letters)"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            mask="aa"
          />
          <div className="flex justify-between">
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="district"
              placeholder="State/District"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
        </div>
        <div>
          <span className="font-semibold text-[#ffff]/90">
            Send email recipients to
          </span>

          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="email"
            placeholder="Email address"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
          />
        </div>
        {/* this component needs to be renamed but its a button currently */}
        <PayPage defaultPayin={defaultPayin} />
        <PassesPinkButton
          name="Confirm and Continue"
          type={ButtonTypeEnum.SUBMIT}
        />
      </form>
    </Modal>
  )
}

export default CreditCardModal
