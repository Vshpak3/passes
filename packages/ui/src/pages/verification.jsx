import {
  GetCreatorVerificationStepResponseDtoStepEnum,
  GetPersonaStatusResponseDtoStatusEnum,
  VerificationApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"

const api = new VerificationApi()

const VerificationPage = () => {
  const router = useRouter()

  const personaStatusHandler = useCallback(async () => {
    const result = await api.refreshPersonaVerifications()
    const { status } = result

    if (!status || status === GetPersonaStatusResponseDtoStatusEnum.Failed) {
      const canSubmit = await api.canSubmitPersona()

      if (canSubmit) {
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
              personaStatusHandler()
            }
          }
        })
      }
    }

    if (status === GetPersonaStatusResponseDtoStatusEnum.Pending) {
      setTimeout(() => {
        personaStatusHandler()
      }, 10000)
    }

    if (status === GetPersonaStatusResponseDtoStatusEnum.Completed) {
      await api.submitCreatorVerificationStep({
        submitCreatorVerificationStepRequestDto: {
          step: GetCreatorVerificationStepResponseDtoStepEnum._2Kyc
        }
      })
      router.push("/creator-flow")
    }
  }, [router])

  useEffect(() => {
    personaStatusHandler()
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
