import { VerificationApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { wrapApi } from "../helpers"

//TODO: use canSubmit
const VerificationPage = () => {
  const router = useRouter()
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const client = new Persona.Client({
      templateId: "itmpl_dzFXWpxh3j1MNgGMEmteDfr1",
      environment: "sandbox",
      onReady: () => client.open(),
      onComplete: async ({ inquiryId, status }) => {
        const api = wrapApi(VerificationApi)
        if (status === "completed") {
          await api.submitPersonaInquiry({
            submitPersonaInquiryRequestDto: {
              personaId: inquiryId,
              personaStatus: status
            }
          })

          // await api.submitCreatorVerificationStep({
          //   submitCreatorVerificationStepRequestDto: {
          //     step: "step 3 payout"
          //   }
          // })

          router.push("/creator-flow?step=3")
        }
      }
    })
  })
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<script src="https://cdn.withpersona.com/dist/persona-v4.2.0.js"></script>
	<script>
	</script>`
      }}
    ></div>
  )
}

export default VerificationPage
