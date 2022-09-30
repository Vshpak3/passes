import {
  GetPersonaStatusResponseDtoStatusEnum,
  VerificationApi
} from "@passes/api-client"
import ms from "ms"
import { Client as PersonaClient } from "persona"
import { useCallback, useEffect } from "react"
import { isProd } from "src/helpers/env"

const PERSONA_TEMPLATE_ID = "itmpl_dzFXWpxh3j1MNgGMEmteDfr1"
const PERSONA_HANDLER_TIMEOUT = ms("10 seconds")

const api = new VerificationApi()

interface IPersonaVerification {
  onFinishPersonaVerification: () => void
  showPersonaModal: boolean
}

const PersonaVerification: React.FC<IPersonaVerification> = ({
  onFinishPersonaVerification,
  showPersonaModal
}) => {
  const personaStatusHandler = useCallback(async () => {
    const result = await api.refreshPersonaVerifications()
    const { status } = result

    if (!status || status === GetPersonaStatusResponseDtoStatusEnum.Failed) {
      const canSubmit = await api.canSubmitPersona()

      if (canSubmit) {
        const client: PersonaClient = new PersonaClient({
          templateId: PERSONA_TEMPLATE_ID,
          environment: isProd ? "production" : "sandbox",
          onReady: () => client.open(),
          onComplete: async ({
            inquiryId,
            status
          }: {
            inquiryId: string
            status: string
          }) => {
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
      }, PERSONA_HANDLER_TIMEOUT)
    }

    if (status === GetPersonaStatusResponseDtoStatusEnum.Completed) {
      onFinishPersonaVerification()
    }
  }, [onFinishPersonaVerification])

  useEffect(() => {
    if (showPersonaModal) personaStatusHandler()
  }, [showPersonaModal, personaStatusHandler])

  return null
}

export default PersonaVerification
