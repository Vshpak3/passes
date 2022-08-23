import { useRouter } from "next/router"
import LimitedEditionImg from "public/icons/limited-edition-pass.svg"
import SubscriptionImg from "public/icons/subscription-pass.svg"
import React from "react"
import { PassesPinkButton } from "src/components/atoms"
import { CreatorPassTiles, FormContainer } from "src/components/organisms"
import { usePasses } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const Choice = () => {
  const router = useRouter()
  const { creatorPasses } = usePasses()
  const subscriptionPasses = creatorPasses?.filter((pass) => {
    return pass.type === "subscription"
  })
  const lifetimePasses = creatorPasses?.filter((pass) => {
    return pass.type === "lifetime"
  })

  return (
    <div className="mx-auto -mt-[160px] grid grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      {creatorPasses && creatorPasses.length > 0 ? (
        <>
          <div className="my-4 flex gap-x-4">
            <span className="text-[24px] font-bold text-[#ffff]/90">
              Subscriptions
            </span>
            <hr className="mt-2 grow border-[#2C282D]" />
          </div>
          <div className="flex flex-wrap gap-4">
            {subscriptionPasses?.map((pass) => {
              return (
                <>
                  <CreatorPassTiles passData={pass} />
                </>
              )
            })}
          </div>
          <div className="mb-16 text-base font-medium leading-[19px]">
            <div className="my-4">
              <span className="my-4 text-[24px] font-bold text-[#ffff]/90">
                Lifetime Pass
              </span>
              <div className="my-4 flex flex-wrap gap-4">
                {lifetimePasses?.map((pass) => {
                  return (
                    <>
                      <CreatorPassTiles passData={pass} />
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-12 w-full">
            <div className="text-center text-base font-medium leading-[19px]">
              <span className="text-[#ffff]/90">What type of passes</span>
            </div>
            <div className="text-center text-base font-medium leading-[19px]">
              <span className="text-[#ffff]/70">
                Join now to get the most exclusive content ever created by
                mankind and alien kind and all kinds of kinds of kinds
              </span>
            </div>
          </div>
          <div className="col-span-12 h-[480px] space-y-6 lg:col-[3_/_span_3] lg:max-w-[280px]">
            <FormContainer>
              <div className="mx-auto">
                <SubscriptionImg />
              </div>

              <span className="text-center text-[#ffff]/90">Subscription</span>
              <span className="text-center text-[#ffff]/70">
                Monthly renewal blah blah stuff
              </span>
              <div className="mt-auto">
                <PassesPinkButton
                  name="Get Started"
                  onClick={() =>
                    router.push(
                      "/tools/passes/collection?passType=subscription"
                    )
                  }
                />
              </div>
            </FormContainer>
          </div>
          <div className="col-span-12 min-h-[480px] space-y-6 lg:col-[6_/_span_3] lg:max-w-[280px]">
            <FormContainer>
              <div className="mx-auto">
                <LimitedEditionImg />
              </div>
              <span className="text-center text-[#ffff]/90">
                Lifetime Passes
              </span>
              <span className="text-center text-[#ffff]/70">
                These are literally going to be sold out tomorrow. FOMO in now
                or get rocked by the SOLD OUT text
              </span>
              <div className="mt-auto">
                <PassesPinkButton
                  name="Get Started"
                  onClick={() =>
                    router.push("/tools/passes/collection?passType=lifetime")
                  }
                />
              </div>
            </FormContainer>
          </div>
        </>
      )}
    </div>
  )
}
export default withPageLayout(Choice)
