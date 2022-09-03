import { VerificationApi } from "@passes/api-client"
import { useEffect } from "react"

import { wrapApi } from "../helpers"

//TODO: use canSubmit
const VerificationPage = () => {
  useEffect(() => {
    // eslint-disable-next-line no-undef
    const client = new Persona.Client({
      templateId: "itmpl_dzFXWpxh3j1MNgGMEmteDfr1",
      environment: "sandbox",
      onReady: () => client.open(),
      onComplete: ({ inquiryId, status }) => {
        const api = wrapApi(VerificationApi)
        if (status === "completed") {
          api.submitInquiry({
            submitInquiryRequestDto: {
              personaId: inquiryId,
              personaStatus: status
            }
          })
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
