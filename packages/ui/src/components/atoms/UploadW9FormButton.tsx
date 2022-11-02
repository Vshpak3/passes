import EditIcon from "public/icons/edit.svg"
import React, { FC } from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/Button"
import { ContentService } from "src/helpers/content"
import { errorMessage } from "src/helpers/error"
import { formatText } from "src/helpers/formatters"
import { FileInput } from "./input/FileInput"

interface UploadW9FormProps {
  form: File[]
}

interface W9ButtonProps {
  text: string
  icon: boolean
}

export const UploadW9FormButton: FC<W9ButtonProps> = ({ text, icon }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful }
  } = useForm<UploadW9FormProps>()

  const { form } = watch()

  const uploadW9FormHandler = async ({ form }: UploadW9FormProps) => {
    if (!form || !form[0]) {
      return
    }
    const file = form[0]

    try {
      const contentService = new ContentService()
      await contentService.uploadW9(file)

      reset({})
    } catch (error) {
      errorMessage(error, true)
    }
  }

  return (
    <form onSubmit={handleSubmit(uploadW9FormHandler)}>
      {form && form[0] ? (
        <button
          type="submit"
          disabled={isSubmitSuccessful}
          className="w-full rounded-full bg-passes-green py-1 font-semibold text-black"
        >
          Upload
        </button>
      ) : (
        <FileInput
          accept={[".pdf"]}
          name="form"
          register={register}
          options={{ required: true }}
          trigger={
            <Button
              variant="primary"
              style={{
                background: "rgba(255, 254, 255, 0.15)",
                fontWeight: "bold",
                width: "100%",
                color: "white"
              }}
            >
              {icon && <EditIcon />}
              {formatText(text)}
            </Button>
          }
        />
      )}
    </form>
  )
}
