import { useRouter } from "next/router"
import PassesLogoPink from "public/icons/passes-logo-pink.svg"
import { memo, useEffect, useState } from "react"

import {
  LANDING_MESSAGES,
  LandingMessageEnum,
  LandingStatusEnum
} from "src/helpers/landing-messages"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const PaymentComplete = () => {
  const router = useRouter()
  const [status, setStatus] = useState<LandingStatusEnum>()
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    if (router.isReady) {
      const query = router.query
      const landingMessage = query.lm as LandingMessageEnum
      const result = query.r as LandingStatusEnum
      if (landingMessage && result && LANDING_MESSAGES[result]) {
        setStatus(result)
        if (LANDING_MESSAGES[result][landingMessage]) {
          setMessage(LANDING_MESSAGES[result][landingMessage])
        }
        // TODO: keep other query params and hashes
        window.history.replaceState(window.history.state, "", "?")
      }
    }
  }, [router])

  return status ? (
    <div className="m-auto mt-[20vh] flex flex-col justify-center text-center">
      <div className="relative h-[30vh] w-[100vw] max-w-[800px]  md:w-[60vw] lg:w-[30vw]">
        <div className="modal-gradient absolute h-0 w-full pt-[100%]" />
        <div className="absolute flex w-full flex-row justify-center">
          <div className="rounded-[8px] bg-[#18090E]/[0.75] p-16">
            <div className="flex w-full flex-row justify-center pb-4">
              <PassesLogoPink className="mt-2 block h-[30x] w-[30px] fill-current" />
            </div>
            <span className="text-[24px]">{message}</span>
            <br />
            <br />
            <span className="text-[16px]">You may now close this window.</span>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default WithNormalPageLayout(memo(PaymentComplete), {
  header: false,
  sidebar: false
})
