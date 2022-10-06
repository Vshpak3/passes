import ms from "ms"
import { useEffect, useState } from "react"

const DEFAULT_TIMEOUT = ms("1 second")

/**
 * Used to prevent immediate form resubmission.
 *
 * @param isSubmitting Should be passed in from useForm's formState
 * @param timeout Optional timeout for how long to delay resubmission
 * @returns Boolean to represent whether or not to disable the form
 */
export const useFormSubmitTimeout = (
  isSubmitting: boolean,
  timeout: number = DEFAULT_TIMEOUT
) => {
  const [disableForm, setDisableForm] = useState(isSubmitting)

  useEffect(() => {
    if (isSubmitting) {
      setDisableForm(true)
    } else {
      setTimeout(() => setDisableForm(false), timeout)
    }
  }, [isSubmitting, timeout])

  return {
    disableForm
  }
}
