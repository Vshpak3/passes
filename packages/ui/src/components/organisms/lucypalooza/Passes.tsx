import {
  GetPassHoldingsRequestDtoOrderEnum,
  GetPassHoldingsResponseDtoOrderTypeEnum,
  PassApi,
  PassDto,
  PassDtoChainEnum,
  PassHolderDto,
  PayinDtoPayinStatusEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi,
  UserApi
} from "@passes/api-client"
import classNames from "classnames"
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { toast } from "react-toastify"
import ConditionRendering from "src/components/molecules/ConditionRendering"
import PassCard from "src/components/molecules/lucypalooza/PassCard"
import PassSuccess from "src/components/molecules/lucypalooza/PassSuccess"
import { BuyPassButton } from "src/components/molecules/payment/buy-pass-button"
import Modal from "src/components/organisms/Modal"
import PaymentSettings from "src/components/pages/settings/tabs/PaymentSettings"
import AddCard from "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/AddCard"
import { ContentService } from "src/helpers"
import { usePayinMethod } from "src/hooks"
interface IPassList {
  passes: PassDto[]
  setPassId: Dispatch<SetStateAction<string | undefined>>
  passId?: string
}
const PassList = ({ passes, setPassId, passId }: IPassList) => {
  return (
    <>
      {passes?.map((pass) => (
        <PassCard
          key={pass.passId}
          title={pass.title}
          price={pass.price}
          ethPrice={pass.ethPrice ?? 0}
          img={{
            url: pass.creatorId ? ContentService.passVideo(pass.passId) : "",
            alt: "pass card"
          }}
          description={pass.description}
          onSelect={() => {
            setPassId(pass.passId)
          }}
          isSelected={passId === pass.passId}
        />
      ))}
    </>
  )
}
const MemoPassList = React.memo(PassList)
const Passes = () => {
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
      getCards()

      const res = await api.getCreatorPasses({
        getCreatorPassesRequestDto: { creatorId: userId }
      })
      setPasses(
        res.passes.filter((pass) => pass.chain === PassDtoChainEnum.Eth)
      )
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPayinState = useCallback(async () => {
    const api = new PaymentApi()
    const passApi = new PassApi()
    const passHoldings = await passApi.getPassHoldings({
      getPassHoldingsRequestDto: {
        order: GetPassHoldingsRequestDtoOrderEnum.Asc,
        orderType: GetPassHoldingsResponseDtoOrderTypeEnum.CreatedAt
      }
    })
    setPassHolder(
      passHoldings.passHolders.length > 0
        ? passHoldings.passHolders[0]
        : undefined
    )
    const payins = await api.getPayins({
      getPayinsRequestDto: { limit: 10, offset: 0 }
    })
    const failed = payins.payins.filter(
      (payin) =>
        payin.payinStatus === PayinDtoPayinStatusEnum.Failed && !!payin.card
    )
    if (
      passHoldings.passHolders.length === 0 &&
      failed.length > 0 &&
      !failedMessage
    ) {
      toast.error("A previous payment failed, please try again")
      setFaileddMessage(true)
    }
    const paying = payins.payins.filter(
      (payin) =>
        payin.payinStatus === PayinDtoPayinStatusEnum.Created ||
        payin.payinStatus === PayinDtoPayinStatusEnum.Pending
    )
    setIsPaying(paying.length > 0)
    setIsLoading(false)
  }, [failedMessage])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      getPayinState()
      setCount(count + 1)
    }, 1e3)
    return () => clearTimeout(timer)
  }, [count, getPayinState])
  useEffect(() => {
    setPassId(passHolder?.passId)
  }, [passHolder])

  return (
    <section className="relative mt-[264px] px-5">
      {/* bg shadow */}
      <div className="absolute top-[-106px] left-[31px] h-[790px] w-[1354px] bg-[linear-gradient(107.68deg,#F2BD6C_2.58%,#BD499B_56.98%,#A359D5_87.5%)] opacity-[0.25] blur-[125px]" />

      <div
        className={classNames("mx-auto flex max-w-[1008px] space-x-12", {
          "pointer-events-none opacity-50": !!passHolder
        })}
      >
        {!!passes && (
          <MemoPassList passes={passes} setPassId={setPassId} passId={passId} />
        )}
      </div>
      <ConditionRendering condition={!isLoading}>
        <ConditionRendering
          condition={!!passId && !passHolder && isPaying === false}
        >
          <div className="mx-auto w-full max-w-[480px] bg-black">
            <PaymentSettings addCardHandler={() => setOpen(true)} isEmbedded />
            <BuyPassButton
              passId={passId ?? ""}
              isDisabled={
                !defaultPayinMethod ||
                defaultPayinMethod.method === PayinMethodDtoMethodEnum.None ||
                !passId ||
                passId.length == 0
              }
              onSuccess={() => {
                toast.success("Thank you for your purchase!")
                setIsPaying(true)
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
        </ConditionRendering>
        {
          // Oleh TODO: use the same condition to disable the whole Payment part (the above part^)
          // instead of a new render
        }
        <ConditionRendering condition={!passHolder && isPaying}>
          Processing Payment
        </ConditionRendering>
        <ConditionRendering condition={!!passHolder}>
          <PassSuccess
            passId={passHolder?.passId ?? ""}
            tokenId={passHolder?.tokenId ?? ""}
          />
        </ConditionRendering>
      </ConditionRendering>
    </section>
  )
}

export default Passes
