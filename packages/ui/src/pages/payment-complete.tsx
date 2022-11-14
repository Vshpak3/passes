import { useRouter } from "next/router"
import { memo, useEffect, useState } from "react"

import {
  LANDING_MESSAGES,
  LandingMessageEnum,
  LandingStatusEnum
} from "src/helpers/landing-messages"
import { WithStandAlonePageLayout } from "src/layout/WithStandAlonePageLayout"

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
    <>
      <span className="text-[24px]">{message}</span>
      <br />
      <br />
      <span className="text-[16px]">You may now close this window.</span>
    </>
  ) : null
}

export default WithStandAlonePageLayout(memo(PaymentComplete), {
  className: "h-[30vh] w-[100vw] max-w-[400px] my-[15vh]"
})
