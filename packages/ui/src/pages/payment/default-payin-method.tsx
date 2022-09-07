import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { PassesPinkButton } from "src/components/atoms"
import { CreditCardModal } from "src/components/organisms"
import { usePayment, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"
// const EVM_CHAINID = {
//   1: "Ethereum($ETH)",
//   5: "Ethereum($ETH)",

//   137: "Polygon($MATIC)",
//   80001: "Polygon($MATIC)",

//   43114: "Avalance($AVAX)",
//   43113: "Avalance($AVAX)"
// }

const DefaultPayinMethod = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const {
    cards,
    setDefaultPayinMethod,
    defaultPayinMethod: defaultPayin,
    deleteCard
  } = usePayment()

  const { user, loading } = useUser()
  const router = useRouter()

  const submit = async (dto: PayinMethodDto) => {
    setDefaultPayinMethod(dto)
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      console.log("r2")
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

  return (
    <AuthOnlyWrapper isPage>
      <div className="mx-auto -mt-[160px] grid grid-cols-10 gap-5 px-4 text-[#ffff]/90 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
        <div className="col-span-12 w-full">
          <div className="mb-16 text-base font-medium leading-[19px]">
            <div className="my-4 flex gap-x-4">
              <span className="text-[24px] font-bold text-[#ffff]/90">
                Payment Methods
              </span>
            </div>
            <div className="my-4 flex gap-x-4">
              <span className="font-bold text-[#ffff]/90">
                Manage your payment methods and set your default currency.
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-2 w-full">
          <span className="text-[#ffff]/70">Payment Methods</span>
          {/* wip */}
          {cards.map((card) => {
            return (
              <div key="card" className="flex">
                <span>
                  {card.name} - {card.fourDigits}
                </span>
                <span>
                  Circle card account{" "}
                  {/* this might need to be placed in BE
                  as a new field called "type" or something */}
                </span>
                {!card.active && (
                  <PassesPinkButton
                    name="Set as default"
                    onClick={() =>
                      submit({
                        cardId: card.id,
                        method: PayinMethodDtoMethodEnum.CircleCard
                      })
                    }
                  />
                )}
              </div>
            )
          })}
          {/* wip */}
          <PassesPinkButton
            name="Add payment method"
            className="w-[200px]"
            onClick={() => setModalOpen(true)}
          />
        </div>
        <div className="col-span-12 w-full">
          <p>
            Your current payment method: {defaultPayin === undefined && "none"}
            {defaultPayin !== undefined &&
              "method - " +
                defaultPayin.method +
                " | cardId - " +
                defaultPayin.cardId +
                " | chainId - " +
                defaultPayin.chainId}
          </p>
          <br />

          <button
            onClick={() => {
              submit({
                chainId: 5,
                method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc
              })
            }}
          >
            ETH USDC on Metamask
          </button>
          <br />
          <button
            onClick={() => {
              submit({
                chainId: 43113,
                method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc
              })
            }}
          >
            AVAX USDC on Metamask
          </button>
          <br />
          <button
            onClick={() => {
              submit({
                chainId: 80001,
                method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc
              })
            }}
          >
            POLYGON USDC on Metamask
          </button>
          <br />
          <button
            onClick={() => {
              submit({
                method: PayinMethodDtoMethodEnum.PhantomCircleUsdc
              })
            }}
          >
            SOL USDC on Phantom
          </button>
          <br />
          <button
            onClick={() => {
              submit({
                chainId: 5,
                method: PayinMethodDtoMethodEnum.MetamaskCircleEth
              })
            }}
          >
            ETH on Metamask
          </button>
          <br />
          {cards?.map((card, i) => {
            return (
              <div key={i}>
                <button
                  onClick={() => {
                    submit({
                      cardId: card.id,
                      method: PayinMethodDtoMethodEnum.CircleCard
                    })
                  }}
                  {...(card.status !== "complete" ? { disabled: true } : {})}
                >
                  Card ending in {card.fourDigits} expiring on {card.expMonth}/
                  {card.expYear}
                  <br />
                  status: {card.status}
                </button>

                <br />
                <button
                  onClick={() => {
                    deleteCard(card.id)
                  }}
                >
                  delete
                </button>
                <br />
              </div>
            )
          })}
        </div>
        {/* <div onClick={() => toast.success("rewognerg")}>
          <span className="text-white">gekjwbnfkjwbedfkj</span>
        </div> */}
      </div>
      {/* pass in payment method to the modal to the button */}
      <CreditCardModal
        isOpen={isModalOpen}
        setOpen={setModalOpen}
        defaultPayin={defaultPayin}
      />
    </AuthOnlyWrapper>
  )
}
export default withPageLayout(DefaultPayinMethod)
