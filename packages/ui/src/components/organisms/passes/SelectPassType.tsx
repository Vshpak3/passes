import { PassDtoTypeEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import LimitedEditionImg from "public/icons/limited-edition-pass.svg"
import SubscriptionImg from "public/icons/subscription-pass.svg"
import { FC } from "react"
import { CreatePassHeader } from "src/components/atoms/passes/CreatePass"
import { CreatePassOption } from "src/components/molecules/pass/CreatePassOption"

interface SelectPassTypeProps {
  initialCreation?: boolean
}

export const SelectPassType: FC<SelectPassTypeProps> = ({
  initialCreation = false
}) => {
  const router = useRouter()

  const createPassTitle = `Create a Pass${
    initialCreation ? " to get started" : ""
  }`

  const redirectToCreatePass = (type: string) => () =>
    router.push(`/tools/manage-passes/create?passType=${type}`)

  return (
    <div className="mx-auto -mt-[160px] grid w-full max-w-[1000px] grid-cols-10 justify-center gap-5 px-4 lg:px-0">
      <CreatePassHeader title={createPassTitle} />
      <CreatePassOption
        colStyle="lg:col-[3_/_span_3]"
        icon={<SubscriptionImg />}
        title="Subscription"
        subtitle="Subscription Passes are unlimited in quantity and must be paid for
            by fans on a recurring basis before they expire."
        onGetStarted={redirectToCreatePass(PassDtoTypeEnum.Subscription)}
      />
      <CreatePassOption
        colStyle="lg:col-[6_/_span_3]"
        icon={<LimitedEditionImg />}
        title="Lifetime"
        subtitle="Lifetime Passes are limited in quantity. This means once they
            sell out they can only be bought on a secondary market. Fans make a
            one-time payment to buy these passes."
        onGetStarted={redirectToCreatePass(PassDtoTypeEnum.Lifetime)}
      />
    </div>
  )
}
