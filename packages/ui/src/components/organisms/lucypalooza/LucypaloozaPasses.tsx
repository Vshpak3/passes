import {
  GetPassHoldingsRequestDtoOrderEnum,
  GetPassHoldingsRequestDtoOrderTypeEnum,
  PassApi,
  PassDto,
  PassDtoChainEnum,
  PassHolderDto,
  PayinDto,
  PayinDtoPayinStatusEnum,
  PayinMethodDto,
  PayinMethodDtoMethodEnum,
  PaymentApi,
  UserApi
} from "@passes/api-client"
import classNames from "classnames"
import ms from "ms"
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms/Button"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { PassCard } from "src/components/molecules/lucypalooza/PassCard"
import { PassSuccess } from "src/components/molecules/lucypalooza/PassSuccess"
import { BuyPassButton } from "src/components/molecules/payment/buy-pass-button"
import PaymentSettings from "src/components/pages/settings/tabs/PaymentSettings"
import { ContentService } from "src/helpers/content"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface PassListProps {
  passes: PassDto[]
  setPassId: Dispatch<SetStateAction<string | undefined>>
  passId?: string
}
export const PassList: FC<PassListProps> = ({ passes, setPassId, passId }) => {
  return (
    <>
      {passes?.map((pass) => (
        // TODO: rework this to use the pass object as a prop
        <PassCard
          key={pass.passId}
          title={pass.title}
          price={pass.price}
          remainingSupply={pass.remainingSupply || 0}
          ethPrice={pass.ethPrice ?? 0}
          img={{
            url: pass.creatorId
              ? ContentService.passAnimation(pass.passId, "mp4")
              : "",
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

export const Passes = () => {
  const [passes, setPasses] = useState<PassDto[]>([])
  const [passHolder, setPassHolder] = useState<PassHolderDto>()
  const [isPaying, setIsPaying] = useState<boolean>(false)
  const [payin, setPayin] = useState<PayinDto>()
  const [passId, setPassId] = useState<string>()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { defaultPayinMethod, setDefaultPayinMethod } = usePayinMethod()
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  useEffect(() => {
    const api = new PassApi()
    const fetch = async () => {
      const userApi = new UserApi()
      const userId = await userApi.getUserId({ username: "patzhang" })

      const res = await api.getCreatorPasses({
        getPassesRequestDto: { creatorId: userId }
      })
      setPasses(res.data.filter((pass) => pass.chain === PassDtoChainEnum.Eth))
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSetDefaultPayment = (value: PayinMethodDto) => {
    setDefaultPayinMethod(value)
  }

  const handleCancel = async () => {
    const api = new PaymentApi()

    if (payin) {
      await api.cancelPayin({
        payinId: payin.payinId
      })
      setIsPaying(false)
    }
  }
  const getPayinState = useCallback(async () => {
    const api = new PaymentApi()
    const passApi = new PassApi()
    const passHoldings = (
      await passApi.getPassHoldings({
        getPassHoldingsRequestDto: {
          order: GetPassHoldingsRequestDtoOrderEnum.Asc,
          orderType: GetPassHoldingsRequestDtoOrderTypeEnum.CreatedAt
        }
      })
    ).data.filter((passHolder) => {
      for (let i = 0; i < passes.length; i++) {
        if (passHolder.passId === passes[i].passId) {
          return true
        }
      }
      return false
    })
    setPassHolder(passHoldings.length > 0 ? passHoldings[0] : undefined)
    const payins = await api.getPayins({
      getPayinsRequestDto: {}
    })
    const paying = payins.data.filter(
      (payin) =>
        payin.payinStatus === PayinDtoPayinStatusEnum.CreatedReady ||
        payin.payinStatus === PayinDtoPayinStatusEnum.Created ||
        payin.payinStatus === PayinDtoPayinStatusEnum.Pending ||
        payin.payinStatus === PayinDtoPayinStatusEnum.SuccessfulReady
    )
    if (paying[0]) {
      setPayin(payins.data[0])
    }
    if (Date.now() - lastUpdated.valueOf() > ms("1 second")) {
      setIsPaying(paying.length > 0)
      setLastUpdated(new Date())
    }
    setIsLoading(false)
  }, [lastUpdated, passes])
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
        className={classNames(
          "mx-auto flex max-w-[1008px] flex-col md:flex-row md:space-x-12",
          {
            "pointer-events-none opacity-50": !!passHolder
          }
        )}
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
            <br />
            <span>
              <b>
                Paying with crypto will mint directly to the paying address. If
                you pay with card, we will keep it for you in a custodial wallet
                that you can transfer later!
              </b>
            </span>
            <PaymentSettings
              isEmbedded
              onSetDefaultPayment={onSetDefaultPayment}
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
                switch (defaultPayinMethod?.method) {
                  case PayinMethodDtoMethodEnum.CircleCard:
                    toast.success("Thank you for your purchase!")
                    break
                  case PayinMethodDtoMethodEnum.MetamaskCircleEth:
                  case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
                  case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
                    toast.info(
                      "Transaction sent, please monitor for success or failure"
                    )
                    break
                  default:
                    toast.error("No method selected while trying to pay")
                }
                setIsPaying(true)
              }}
            />
          </div>
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
              <Button tag="button" variant="pink" disabled={true}>
                <span className="px-20 text-xl">Processing...</span>
              </Button>
            </div>
            <span>
              Please wait. This might take a few minutes, do not go back or
              refresh this page.
            </span>
            {payin &&
              payin.payinMethod.method ===
                PayinMethodDtoMethodEnum.CircleCard && (
                <span>
                  For card payments, please verify your payment with your
                  provider.
                </span>
              )}
            {payin &&
              payin.payinMethod.method !==
                PayinMethodDtoMethodEnum.CircleCard && (
                <>
                  <span>
                    We are waiting for your crypto payment. If the transaction
                    was cancelled or failed, please cancel payemnt.
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
                </>
              )}
          </div>
        </ConditionRendering>
        <ConditionRendering condition={!!passHolder}>
          {passHolder && <PassSuccess pass={passHolder} />}
        </ConditionRendering>
      </ConditionRendering>
    </section>
  )
}
