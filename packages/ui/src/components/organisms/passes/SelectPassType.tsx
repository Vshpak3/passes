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

  const createPassTitle = `Create a Membership${
    initialCreation ? " to get started" : ""
  }`

  const redirectToCreatePass = (type: string) => () =>
    router.push(`/tools/manage-passes/create?passType=${type}`)

  return (
    <div className="mx-auto mt-4 w-full max-w-[1000px] grid-cols-10 justify-center gap-5 px-4 md:grid lg:px-0">
      <CreatePassHeader title={createPassTitle} />
      <CreatePassOption
        colStyle="lg:col-[3_/_span_3]"
        icon={<SubscriptionImg />}
        onGetStarted={redirectToCreatePass(PassDtoTypeEnum.Subscription)}
        subtitle="Subscriptions are unlimited in quantity and must be paid for
            by fans on a recurring basis before they expire."
        title="Subscription"
      />
      <CreatePassOption
        colStyle="lg:col-[6_/_span_3]"
        icon={<LimitedEditionImg />}
        onGetStarted={redirectToCreatePass(PassDtoTypeEnum.Lifetime)}
        subtitle="Super Memberships are limited in quantity. This means once they
            sell out they can only be bought on a secondary market. Fans make a
            one-time payment to buy these memberships."
        title="Lifetime"
      />
    </div>
  )
}
