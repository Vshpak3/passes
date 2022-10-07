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
import { Button } from "src/components/atoms"
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
        // TODO: rework this to use the pass object as a prop
        <PassCard
          key={pass.passId}
          title={pass.title}
          price={pass.price}
          totalSupply={pass.totalSupply}
          remainingSupply={pass.remainingSupply}
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
  const [payinId, setPayinId] = useState<string>()
  const [passId, setPassId] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)
  const [failedMessage, setFaileddMessage] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { defaultPayinMethod, getCards, getDefaultPayinMethod } =
    usePayinMethod()
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

  const handleCancel = async () => {
    const api = new PaymentApi()

    if (payinId && payinId.length) {
      await api.cancelPayin({
        payinId
      })
      setTimeout(() => {
        setIsPaying(false)
      }, 500)
    }
  }
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
    if (
      paying[0] &&
      paying[0].payinStatus === PayinDtoPayinStatusEnum.Pending
    ) {
      setPayinId(payins.payins[0].id)
    }
    setIsPaying(isPaying || paying.length > 0)
    setIsLoading(false)
  }, [failedMessage, isPaying])
  const [count, setCount] = useState(0)
  const handleDefaultPaymentSet = async () => {
    await getDefaultPayinMethod()
  }
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
            <PaymentSettings
              addCardHandler={() => setOpen(true)}
              isEmbedded
              onSetDefaultPayment={handleDefaultPaymentSet}
            />
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
                setTimeout(() => {
                  getCards()
                }, 500)
              }}
            />
          </Modal>
        </ConditionRendering>
        {
          // Oleh TODO: use the same condition to disable the whole Payment part (the above part^)
          // instead of a new render
        }
        <ConditionRendering condition={!passHolder && isPaying}>
          <div className="flex h-[50vh] w-full flex-col items-center justify-center">
            <span className="text-xl font-bold">
              We are processing your payment and minting your pass!
            </span>
            <div className="my-5">
              <Button tag="button" variant="pink">
                <span className="px-20 text-xl">Processing...</span>
              </Button>
            </div>
            <span>
              Please wait. This might take a few minutes, do not go back or
              refresh this page.
            </span>
            <span>
              If you paid with card, please verify your payment with your
              provider.
            </span>
            <div className="mt-5">
              <Button
                onClick={handleCancel}
                tag="button"
                variant="purple-light"
              >
                <span className="px-20 text-lg">Cancel</span>
              </Button>
            </div>
          </div>
        </ConditionRendering>
        <ConditionRendering condition={!!passHolder}>
          <PassSuccess
            title={passHolder?.title ?? ""}
            passId={passHolder?.passId ?? ""}
            tokenId={passHolder?.tokenId ?? ""}
          />
        </ConditionRendering>
      </ConditionRendering>
    </section>
  )
}

export default Passes
