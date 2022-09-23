import {
  GetCreatorVerificationStepResponseDtoStepEnum,
  VerificationApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect } from "react"

const api = new VerificationApi()

const nextStepHandler = async () => {
  const doneVerification = await refreshPersonaVerificationHandler()
  if (doneVerification) {
    await api.submitCreatorVerificationStep({
      submitCreatorVerificationStepRequestDto: {
        step: GetCreatorVerificationStepResponseDtoStepEnum._2Kyc
      }
    })
  }
}

const refreshPersonaVerificationHandler = async () => {
  const result = await api.refreshPersonaVerifications()

  //TODO handle pending and complete status

  if (!result) return true
}

const VerificationPage = () => {
  const router = useRouter()

  async function personaModalHandler() {
    const continueVerification = await refreshPersonaVerificationHandler()
    const canSubmit = await api.canSubmitPersona()

    if (continueVerification && canSubmit) {
      // eslint-disable-next-line no-undef
      const client = new Persona.Client({
        templateId: "itmpl_dzFXWpxh3j1MNgGMEmteDfr1",
        environment: "sandbox",
        onReady: () => client.open(),
        onComplete: async ({ inquiryId, status }) => {
          if (status === "completed") {
            await api.submitPersonaInquiry({
              submitPersonaInquiryRequestDto: {
                personaId: inquiryId,
                personaStatus: status
              }
            })
            await nextStepHandler()
            router.push("/creator-flow")
          }
        }
      })
    }
  }
  useEffect(() => {
    personaModalHandler()
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
