import {
  GetPersonaStatusResponseDtoStatusEnum,
  VerificationApi
} from "@passes/api-client"
import ms from "ms"
import React, { FC, useCallback, useEffect, useState } from "react"
import { isProd } from "src/helpers/env"

const PERSONA_TEMPLATE_ID = "itmpl_dzFXWpxh3j1MNgGMEmteDfr1"
const PERSONA_HANDLER_TIMEOUT = ms("10 seconds")

interface IPersonaVerification {
  onFinishPersonaVerification: () => void
  showPersonaModal: boolean
}

const PersonaVerification: FC<IPersonaVerification> = ({
  onFinishPersonaVerification,
  showPersonaModal
}) => {
  const [isLoadedPersonaScript, setIsLoadedPersonaScript] = useState(false)

  const personaStatusHandler = useCallback(async () => {
    const api = new VerificationApi()
    const result = await api.refreshPersonaVerifications()
    const { status } = result

    if (!status || status === GetPersonaStatusResponseDtoStatusEnum.Failed) {
      const canSubmit = await api.canSubmitPersona()

      if (canSubmit) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const client = new Persona.Client({
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
    if (showPersonaModal && isLoadedPersonaScript) {
      personaStatusHandler()
    }
  }, [showPersonaModal, personaStatusHandler, isLoadedPersonaScript])

  useEffect(() => {
    const scriptEl = document.createElement("script")
    scriptEl.src = "https://cdn.withpersona.com/dist/persona-v4.2.0.js"
    document.body.append(scriptEl)
    scriptEl.addEventListener("load", () => setIsLoadedPersonaScript(true))
  }, [])

  return null
}

export default React.memo(PersonaVerification)
