import {
  GetPassHoldingsRequestDtoOrderEnum,
  GetPassHoldingsResponseDtoOrderTypeEnum,
  PassApi,
  PassDto,
  PassHolderDto,
  PayinDtoPayinStatusEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi,
  UserApi
} from "@passes/api-client"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import { BuyPassButton } from "src/components/molecules/payment/buy-pass-button"
import { Modal } from "src/components/organisms"
import AddCard from "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/AddCard"
import { usePayinMethod } from "src/hooks"
const PaymentSettings = dynamic(
  () => import("src/components/pages/settings/tabs/PaymentSettings/index")
)
import { withPageLayout } from "src/layout/WithPageLayout"

const Home = () => {
  const [passes, setPasses] = useState<PassDto[]>()
  const [passHolder, setPassHolder] = useState<PassHolderDto>()
  const [isPaying, setIsPaying] = useState<boolean>(false)
  const [passId, setPassId] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)
  const [failedMessage, setFaileddMessage] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { defaultPayinMethod, getCards } = usePayinMethod()

  useEffect(() => {
    const api = new PassApi()
    const fetch = async () => {
      const userApi = new UserApi()
      const userId = await userApi.getUserId({ username: "patzhang" })
      const passHoldings = await api.getPassHoldings({
        getPassHoldingsRequestDto: {
          order: GetPassHoldingsRequestDtoOrderEnum.Asc,
          orderType: GetPassHoldingsResponseDtoOrderTypeEnum.CreatedAt
        }
      })
      getCards()
      setPassHolder(
        passHoldings.passHolders.length > 0
          ? passHoldings.passHolders[0]
          : undefined
      )
      const res = await api.getCreatorPasses({
        getCreatorPassesRequestDto: { creatorId: userId }
      })
      setPasses(res.passes)
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPayinState = useCallback(async () => {
    const api = new PaymentApi()
    const payins = await api.getPayins({
      getPayinsRequestDto: { limit: 10, offset: 0 }
    })
    const failed = payins.payins.filter(
      (payin) =>
        payin.payinStatus === PayinDtoPayinStatusEnum.Failed && !!payin.card
    )
    if (failed.length > 0 && !failedMessage) {
      toast.error("A previous card payment failed, please try again")
      setFaileddMessage(true)
    }
    const paying = payins.payins.filter(
      (payin) =>
        payin.payinStatus === PayinDtoPayinStatusEnum.Pending ||
        (payin.payinStatus === PayinDtoPayinStatusEnum.Created &&
          payin.payinMethod.method !== PayinMethodDtoMethodEnum.CircleCard)
    )
    setIsPaying(paying.length > 0)
    setIsLoading(false)
  }, [failedMessage])

  useEffect(() => {
    const timer = setTimeout(() => getPayinState(), 1e3)
    return () => clearTimeout(timer)
  }, [getPayinState])

  return (
    <>
      <ConditionRendering condition={isLoading}>Loading</ConditionRendering>
      <ConditionRendering condition={!isLoading}>
        <ConditionRendering condition={!passHolder && isPaying === false}>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          <div className="w-full bg-black">
            <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
              <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
                {passes?.map((pass) => (
                  <div key={pass.passId}>
                    <button onClick={() => setPassId(pass.passId)}>
                      {pass.title}
                      <br />
                      {pass.description}
                      <br />${pass.price}{" "}
                      {pass.ethPrice
                        ? "or " + pass.ethPrice / 10 ** 18 + " eth"
                        : ""}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <PaymentSettings addCardHandler={() => setOpen(true)} isEmbedded />

            <BuyPassButton
              passId={passId ?? ""}
              isDisabled={!defaultPayinMethod || !passId || passId.length == 0}
              onSuccess={function (): void {
                toast.success("Thank you for your purchase!")
              }}
            />
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
          </div>
        </ConditionRendering>
        <ConditionRendering condition={!passHolder && isPaying}>
          Processing Payment
        </ConditionRendering>
        <ConditionRendering condition={!!passHolder}>
          WELCOME TODO: show pass info
        </ConditionRendering>
      </ConditionRendering>
    </>
  )
}

export default withPageLayout(Home, { header: false, sidebar: false })
