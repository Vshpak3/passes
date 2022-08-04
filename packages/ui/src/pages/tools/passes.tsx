import { useRouter } from "next/router"
import LimitedEditionImg from "public/icons/limited-edition-pass.svg"
import SubscriptionImg from "public/icons/subscription-pass.svg"
import React from "react"
import { PassesPinkButton } from "src/components/common/Buttons"
import { withPageLayout } from "src/components/pages/WithPageLayout"
import { FormContainer } from "src/containers/form-container"

const Passes = () => {
  const router = useRouter()

  return (
    <div className="mx-auto -mt-[205px] grid grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
      <div className="col-span-12 w-full">
        <div className="text-center text-base font-medium leading-[19px]">
          <span className="text-[#ffff]/90">What type of passes</span>
        </div>
        <div className="text-center text-base font-medium leading-[19px]">
          <span className="text-[#ffff]/70">
            Join now to get the most exclusive content ever created by mankind
            and alien kind and all kinds of kinds of kinds
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
                router.push("/tools/passes/collection?passType=subscription")
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
          <span className="text-center text-[#ffff]/90">Limited Edition</span>
          <span className="text-center text-[#ffff]/70">
            These are literally going to be sold out tomorrow. FOMO in now or
            get rocked by the SOLD OUT text
          </span>
          <div className="mt-auto">
            <PassesPinkButton
              name="Get Started"
              onClick={() =>
                router.push("/tools/passes/collection?passType=limited_edition")
              }
            />
          </div>
        </FormContainer>
      </div>
    </div>
  )
}
export default withPageLayout(Passes)
