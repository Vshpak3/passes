import {
  CreateWelcomeMessageRequestDto,
  GetWelcomeMessageResponseDto,
  MessagesApi
} from "@passes/api-client"
import { useCallback, useEffect } from "react"
import { toast } from "react-toastify"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"

const CACHE_KEY_WELCOME_MESSAGE = "/welcome_message"

export const useWelcomeMessage = () => {
  const api = new MessagesApi()

  const {
    data: welcomeMessage,
    isValidating: isLoading,
    mutate
  } = useSWR<GetWelcomeMessageResponseDto>(
    CACHE_KEY_WELCOME_MESSAGE,
    async () => {
      return await api.getWelcomeMessage()
    }
  )

  const { mutate: _mutateManual } = useSWRConfig()

  const mutateManual = useCallback(
    (update: CreateWelcomeMessageRequestDto) =>
      _mutateManual(CACHE_KEY_WELCOME_MESSAGE, update, {
        populateCache: (
          update: CreateWelcomeMessageRequestDto,
          original: GetWelcomeMessageResponseDto
        ) => {
          return Object.assign(original, update)
        },
        revalidate: false
      }),
    [_mutateManual]
  )

  const createWelcomeMessage = useCallback(
    async (newWelcomeMessage: CreateWelcomeMessageRequestDto) => {
      try {
        const result = await api.createWelcomeMessage({
          createWelcomeMessageRequestDto: newWelcomeMessage
        })
        if (result.value) {
          mutateManual(newWelcomeMessage)
        } else {
          toast.error("Failed to update")
        }
      } catch (error: unknown) {
        errorMessage(error, true)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutateManual]
  )

  useEffect(() => {
    if (!welcomeMessage) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isLoading,
    welcomeMessage,
    createWelcomeMessage
  }
}
