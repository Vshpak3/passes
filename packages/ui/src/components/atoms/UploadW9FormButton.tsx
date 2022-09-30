import EditIcon from "public/icons/edit.svg"
import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "src/components/atoms"

import { ContentService } from "../../helpers"
import FormInput from "./FormInput"

interface IForm {
  form: File[]
}
interface W9Button {
  text: string
  icon: boolean
}

const UploadW9FormButton = ({ text, icon }: W9Button) => {
  const { register, handleSubmit, watch, reset } = useForm<IForm>()

  const { form } = watch()

  const uploadW9FormHandler = async ({ form }: IForm) => {
    if (!form || !form[0]) {
      return
    }
    const file = form[0]

    try {
      const contentService = new ContentService()
      await contentService.uploadW9(file)

      reset({})
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit(uploadW9FormHandler)}>
      {form && form[0] ? (
        <button
          type="submit"
          className="w-full rounded-full bg-passes-green py-1 font-semibold text-black"
        >
          Upload
        </button>
      ) : (
        <FormInput
          accept={[".pdf"]}
          type="file"
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
              {text}
            </Button>
          }
        />
      )}
    </form>
  )
}

export default UploadW9FormButton
