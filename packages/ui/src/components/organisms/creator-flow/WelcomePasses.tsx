import { useRouter } from "next/router"
import LimitedEditionIcon from "public/icons/limited-edition-pass.svg"
import SubscriptionIcon from "public/icons/subscription-pass.svg"

import { ButtonTypeEnum, PassesPinkButton } from "src/components/atoms/Button"

export function WelcomeToPasses() {
  const router = useRouter()

  return (
    <div className="p-12 text-xl text-white">
      <div className="text-center text-2xl">Welcome to Passes!</div>
      <div className="text-center text-sm text-[#737893]">
        Now it&apos;s time to create your first pass!
      </div>

      <div className="mt-12 flex max-w-3xl flex-col gap-10 sm:flex-row">
        <div className="flex min-w-[330px] flex-1 flex-col items-center justify-between rounded-md border border-[#624256] bg-black px-10 py-8">
          <div className="flex flex-col items-center">
            <SubscriptionIcon />
            <div className="mt-5 text-center text-2xl font-bold">
              Subscription
            </div>
            <div className="mt-5 text-center text-base text-[#737893]">
              These are passes that anyone can buy where you charge per month,
              year, or lifetime. They are unlimited in amount
            </div>
          </div>
          <PassesPinkButton
            className="mt-6 font-normal"
            name="Get Started"
            onClick={() =>
              router.push("/tools/manage-passes/create?passType=subscription")
            }
            type={ButtonTypeEnum.BUTTON}
          />
        </div>
        <div className="flex min-w-[330px] flex-1 flex-col items-center justify-between rounded-md border border-[#624256] bg-black px-10 py-8">
          <div className="flex flex-col items-center">
            <LimitedEditionIcon />
            <div className="mt-5 text-center text-2xl font-bold">
              Limited Edition
            </div>
            <div className="mt-5 text-center text-base text-[#737893]">
              These are passes that are limited edition. Once they sell out,
              people will have to buy on the resale market. You get a % royalty
              every time it resales.
            </div>
          </div>
          <PassesPinkButton
            className="mt-6 font-normal"
            name="Get Started"
            onClick={() =>
              router.push("/tools/manage-passes/create?passType=lifetime")
            }
            type={ButtonTypeEnum.BUTTON}
          />
        </div>
      </div>
    </div>
  )
}
