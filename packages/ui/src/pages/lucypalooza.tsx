import {
  PassApi,
  PassDto,
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum,
  UserApi
} from "@passes/api-client"
import CardIcon from "public/icons/bank-card.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms/Button"
import { BuyPassButton } from "src/components/molecules/payment/buy-pass-button"
import { Modal } from "src/components/organisms"
import AddCard from "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/AddCard"
import { displayCardIcon } from "src/helpers/payment/paymentMethod"
import { usePayinMethod, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"
const Home = () => {
  const { mutate } = useUser()
  const [passes, setPasses] = useState<PassDto[]>()
  const [passId, setPassId] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)

  const { cards, defaultPayinMethod, setDefaultPayinMethod, getCards } =
    usePayinMethod()

  const defaultCard = cards.find(
    (card) => card.id === defaultPayinMethod?.cardId
  )

  useEffect(() => {
    mutate()
  }, [mutate])

  useEffect(() => {
    getCards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const api = new PassApi()
    const fetch = async () => {
      const userApi = new UserApi()
      const userId = await userApi.getUserId({ username: "patzhang" })
      const res = await api.getCreatorPasses({
        getCreatorPassesRequestDto: { creatorId: userId }
      })
      setPasses(res.passes)
    }
    fetch()
  }, [])

  return (
    <>
      <div className="w-full bg-black">
        <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
          <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
            {passes?.map((pass) => (
              <div
                key={pass.passId}
                className="m-2 flex h-[227px] w-[248px] flex-col justify-between gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4"
              >
                <button onClick={() => setPassId(pass.passId)}>
                  {pass.title}
                  <br />
                  {pass.description}
                  <br />${pass.price} or ${pass.ethPrice} eth
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="my-8 flex flex-col gap-6 xl:flex-row">
          <div className="flex  w-[248px] flex-col justify-center gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-6">
            <span className="text-[14px] font-[400] opacity-90">
              Payment Methods:
            </span>
            <span className="text-[16px] font-[700]">
              {defaultPayinMethod?.method ?? "Please select a payment method"}
            </span>
            {defaultCard && (
              <div className="flex gap-6">
                <span className="text-[14px] font-[500] opacity-70">
                  *******{defaultCard.fourDigits}
                </span>
                {displayCardIcon(defaultCard.firstDigit, 25)}
              </div>
            )}
          </div>
        </div>
        <div className="align-center mx-auto my-4 flex w-[250px] justify-center">
          <div className="px-2">
            <Button
              icon={<MetamaskIcon />}
              variant="purple-light"
              tag="button"
              className="!px-4 !py-2.5"
              onClick={async () => {
                await setDefaultPayinMethod({
                  method: PayinMethodDtoMethodEnum.MetamaskCircleEth,
                  chain: PayinMethodDtoChainEnum.Eth
                })
              }}
            >
              Ethereum ETH
            </Button>
          </div>
          <div className="px-2">
            <Button
              icon={<MetamaskIcon />}
              variant="purple-light"
              tag="button"
              className="!px-4 !py-2.5"
              onClick={async () => {
                await setDefaultPayinMethod({
                  method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
                  chain: PayinMethodDtoChainEnum.Eth
                })
              }}
            >
              Ethereum USDC
            </Button>
          </div>
          <div className="px-2">
            <Button
              icon={<PhantomIcon />}
              variant="purple-light"
              tag="button"
              className="!px-4 !py-2.5"
              onClick={async () => {
                await setDefaultPayinMethod({
                  method: PayinMethodDtoMethodEnum.PhantomCircleUsdc,
                  chain: PayinMethodDtoChainEnum.Sol
                })
              }}
            >
              Solana USDC
            </Button>
          </div>
        </div>

        <Button
          icon={<CardIcon />}
          variant="purple-light"
          tag="button"
          className="!px-4 !py-2.5"
          onClick={() => setOpen(true)}
        >
          Add card
        </Button>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          Cards
          {cards.map((item) => (
            <div
              key={item.id}
              className="m-2 flex h-[227px] w-[248px] flex-col justify-between gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4"
            >
              <span className="text-[24px] font-[700]">{item.name}</span>
              <span className="text-[12px] font-[500]">
                **** **** **** {item.fourDigits}
              </span>
              <div className="mr-1 flex flex-row justify-between">
                <div className="flex items-center">
                  <div className="flex flex-col ">
                    <span className="-mb-2 w-8 text-[10px] font-[500] opacity-70">
                      VALID
                    </span>
                    <span className="w-8 text-[10px] font-[500] opacity-70">
                      THRU
                    </span>
                  </div>
                  <span className="text-[12px] font-[500]">
                    {item.expMonth}/{item.expYear.toString().slice(-2)}
                  </span>
                </div>
                {displayCardIcon(item.firstDigit, 25)}
              </div>
              <div className="flex flex-row gap-4">
                {item.id === defaultPayinMethod?.cardId ? (
                  <button className="flex h-[44px] flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-passes-dark-200 bg-black px-2 text-white">
                    <span className="text-[14px] font-[700]">Selected</span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setDefaultPayinMethod({
                        cardId: item.id,
                        method: PayinMethodDtoMethodEnum.CircleCard
                      })
                    }
                    className="flex h-[44px] flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white"
                  >
                    <span className="text-[14px] font-[700]">Select</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <BuyPassButton
          passId={passId ?? ""}
          isDisabled={!defaultPayinMethod || !passId || passId.length == 0}
          onSuccess={function (): void {
            toast.success("Thank you for your purchase!")
          }}
        />
      </div>
      <Modal isOpen={open} setOpen={setOpen}>
        <AddCard
          callback={() => {
            setOpen(false)
            setTimeout(async () => {
              await getCards()
            }, 250)
          }}
        />
      </Modal>
    </>
  )
}

export default withPageLayout(Home, { header: false, sidebar: false })
