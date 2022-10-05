import { yupResolver } from "@hookform/resolvers/yup"
import {
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
import React, { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import {
  ButtonTypeEnum,
  FormInput,
  PassesPinkButton
} from "src/components/atoms"
import { EIcon } from "src/components/atoms/Input"
import encrypt from "src/helpers/openpgp"
import { accessTokenKey } from "src/helpers/token"
import { creditCardSchema } from "src/helpers/validation"
import { useLocalStorage } from "src/hooks"
import { v4 } from "uuid"

import Modal from "./Modal"

interface ICreditCardModal {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  defaultPayin: PayinMethodDto | undefined
}

const CreditCardModal = ({ isOpen = false, setOpen }: ICreditCardModal) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
    // getValues,
    // setValue
  } = useForm({
    resolver: yupResolver(creditCardSchema)
  })
  const [accessToken] = useLocalStorage(accessTokenKey, "")

  async function onSubmit(data: any) {
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
    const paymentApi = new PaymentApi()

    const publicKey = await paymentApi.getCircleEncryptionKey()

    const encryptedData = await encrypt(cardDetails, publicKey)

    const { encryptedMessage, keyId } = encryptedData

    payload.createCardDto.keyId = keyId
    payload.createCardDto.encryptedData = encryptedMessage

    //TODO: handle error on frontend (display some generic message)
    const createdCard = await paymentApi.createCircleCard({
      circleCreateCardAndExtraRequestDto: payload
    })

    setTimeout(async () => {
      const cardsResp = await paymentApi.getCircleCards({})
      const card = cardsResp.cards.find((item) => item.id === createdCard.id)

      if (card && card.status === "complete") {
        // set here paymentSetDefaultPayinMethod
        await paymentApi.setDefaultPayinMethod({
          setPayinMethodRequestDto: {
            method: PayinMethodDtoMethodEnum.CircleCard,
            cardId: createdCard.id
          }
        })
      }
    }, 1000)
  }

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      {/* <div className="flex flex-wrap gap-4"> */}
      {/* <Image src="www.google.ca" alt="test" width={200} height={50} /> */}
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e).catch((err) => {
            console.error(`errors: ${err}`)
            toast.error(err)
          })
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
            <MetamaskIcon width="40px" />
          </div>
          <div className="px-2">
            <CoinbaseIcon />
          </div>
          <div className="px-2">
            <TrelloIcon />
          </div>
          <div className="px-2">
            <PhantomIcon width="40px" />
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
              className="m-0 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
          <div>
            <span className="text-[#ffff]/70">Card number</span>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="cardNumber"
              className="m-0 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
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
              className="mb-4 max-w-[60px] border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
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
              className="mb-4 max-w-[75px] border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
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
              className="mb-4 max-w-[70px] border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
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
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
          />
          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="alternativeAddress"
            placeholder="Street address (optional)"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
          />
          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="city"
            placeholder="City"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
          />
          <FormInput
            errors={errors}
            register={register}
            type="text"
            name="country"
            placeholder="Country (2 letters)"
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            mask="aa"
          />
          <div className="flex justify-between gap-4">
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="district"
              placeholder="State/District"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
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
            className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
          />
        </div>
        <PassesPinkButton
          name="Confirm and Continue"
          type={ButtonTypeEnum.SUBMIT}
        />
      </form>
    </Modal>
  )
}

export default CreditCardModal
