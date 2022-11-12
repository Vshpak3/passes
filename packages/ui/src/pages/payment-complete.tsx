import { useRouter } from "next/router"
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
    <div className="m-auto text-center">
      {message}.
      <br />
      You may now close this window.
    </div>
  ) : null
}

export default WithNormalPageLayout(memo(PaymentComplete), {
  header: false,
  sidebar: false
})
