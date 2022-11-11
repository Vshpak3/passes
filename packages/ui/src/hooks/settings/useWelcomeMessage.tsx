import {
  CreateWelcomeMessageRequestDto,
  GetWelcomeMessageResponseDto,
  MessagesApi
} from "@passes/api-client"
import { useCallback } from "react"
import { toast } from "react-toastify"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"

const CACHE_KEY_WELCOME_MESSAGE = "/welcome_message"

const api = new MessagesApi()

export const useWelcomeMessage = () => {
  const {
    data: welcomeMessage,
    isValidating: isLoading,
    mutate
  } = useSWR<GetWelcomeMessageResponseDto>(
    CACHE_KEY_WELCOME_MESSAGE,
    async () => {
      return await api.getWelcomeMessage()
    },
    { revalidateOnMount: true }
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
    async (
      newWelcomeMessage: CreateWelcomeMessageRequestDto,
      successToastMessage = ""
    ) => {
      try {
        const result = await api.createWelcomeMessage({
          createWelcomeMessageRequestDto: newWelcomeMessage
        })

        if (result.value) {
          if (successToastMessage) {
            mutateManual(newWelcomeMessage)
            toast.success(successToastMessage)
          }
        } else {
          toast.error("Failed to update")
        }
      } catch (error: unknown) {
        errorMessage(error, true)
      }
    },
    [mutateManual]
  )

  return {
    isLoading,
    welcomeMessage,
    getWelcomeMessage: mutate,
    createWelcomeMessage
  }
}
