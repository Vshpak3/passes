import {
  GetPassHoldingsRequestDtoOrderEnum,
  GetPassHoldingsResponseDtoOrderTypeEnum,
  PassApi,
  PassDto,
  UserApi
} from "@passes/api-client"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
const PaymentSettings = dynamic(
  () => import("src/components/pages/settings/tabs/PaymentSettings/index")
)
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { BuyPassButton } from "src/components/molecules/payment/buy-pass-button"
import { Modal } from "src/components/organisms"
import AddCard from "src/components/pages/settings/tabs/PaymentSettings/sub-tabs/AddCard"
import { usePayinMethod, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const Home = () => {
  const { mutate } = useUser()
  const router = useRouter()
  const [passes, setPasses] = useState<PassDto[]>()
  const [isHoldings, setIsHolding] = useState<boolean>(false)
  const [passId, setPassId] = useState<string>()
  const [open, setOpen] = useState<boolean>(false)

  const { defaultPayinMethod, getCards } = usePayinMethod()

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
      const passHoldings = await api.getPassHoldings({
        getPassHoldingsRequestDto: {
          order: GetPassHoldingsRequestDtoOrderEnum.Asc,
          orderType: GetPassHoldingsResponseDtoOrderTypeEnum.CreatedAt
        }
      })
      setIsHolding(passHoldings.passHolders.length > 0)
      const res = await api.getCreatorPasses({
        getCreatorPassesRequestDto: { creatorId: userId }
      })
      setPasses(res.passes)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (isHoldings) {
      router.push("/")
    }
  }, [isHoldings, router])

  return (
    <div className="mx-auto mt-10 w-full w-[80vw] bg-black">
      <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
        <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
          {passes?.map((pass) => (
            <div key={pass.passId}>
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
  )
}

export default withPageLayout(Home, { header: false, sidebar: false })
