import { yupResolver } from "@hookform/resolvers/yup"
import {
  CreatePassRequestDtoAccessTypeEnum,
  CreatePassRequestDtoChainEnum,
  CreatePassRequestDtoImageTypeEnum,
  CreatePassRequestDtoTypeEnum,
  PassApi,
  PassDtoTypeEnum
} from "@passes/api-client"
import ms from "ms"
import { useRouter } from "next/router"
import { ChangeEvent, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES_SUBSCRIPTION = 1
const MIN_FILES_SUBSCRIPTION = 0
const MAX_FILES_LIFETIME = 5000
const MIN_FILES_LIFETIME = 1

const THIRTY_DAY_DURATION = ms("30 days")
const THIRTY_DAY_DURATION_LIFETIME = undefined

const MIN_PASS_ROYALTY_PERCENTAGE = 6
const MAX_PASS_ROYALTY_PERCENTAGE = 30

export const createPassSchema = yup.object({
  passName: yup.string().required(),
  passDescription: yup.string().required(),
  royalties: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Royalty percentage is required")
    .integer("Royalty percentage should not be point number")
    .min(
      MIN_PASS_ROYALTY_PERCENTAGE,
      `Royalty percentage should be greater than ${
        MIN_PASS_ROYALTY_PERCENTAGE - 1
      }%`
    )
    .max(
      MAX_PASS_ROYALTY_PERCENTAGE,
      `Royalty percentage should be less than or equal to ${MAX_PASS_ROYALTY_PERCENTAGE}%`
    )
})

export const useCreatePass = (passType: string) => {
  const [files, setFiles] = useState<File[]>([])
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)
  const isLifetimePass = passType === PassDtoTypeEnum.Lifetime
  const isSubscriptionPass = passType === PassDtoTypeEnum.Subscription
  const router = useRouter()

  const MAX_FILES = isLifetimePass ? MAX_FILES_LIFETIME : MAX_FILES_SUBSCRIPTION
  const MIN_FILES = isLifetimePass ? MIN_FILES_LIFETIME : MIN_FILES_SUBSCRIPTION
  const DURATION = isLifetimePass
    ? THIRTY_DAY_DURATION_LIFETIME
    : THIRTY_DAY_DURATION

  const maxFileError = `Maximum upload is ${MAX_FILES} file(s).`
  const minFileError = `Minimum upload is ${MIN_FILES} file(s).`

  const {
    handleSubmit,
    register,
    getValues,
    trigger,
    formState: { errors, isSubmitSuccessful }
  } = useForm({
    resolver: yupResolver(createPassSchema)
  })

  const newPassType = (value: string) => {
    switch (value) {
      case "subscription":
        return CreatePassRequestDtoTypeEnum.Subscription
      case "lifetime":
        return CreatePassRequestDtoTypeEnum.Lifetime
      case "external":
        return CreatePassRequestDtoTypeEnum.External
      default:
        return CreatePassRequestDtoTypeEnum.Subscription
    }
  }

  const onMediaChange = (filesArray: File[]) => {
    if (fileUploadError) {
      setFileUploadError(null)
    }

    let maxFileSizeExceeded = false

    const _files = filesArray.filter((file) => {
      if (!MAX_FILE_SIZE) {
        return true
      }
      if (file.size < MAX_FILE_SIZE) {
        return true
      }
      maxFileSizeExceeded = true
      return false
    })

    if (maxFileSizeExceeded) {
      setFileUploadError("Maximum file size exceeded.")
      return
    }
    if (files.length + _files.length > MAX_FILES) {
      setFileUploadError(maxFileError)
      return
    }
    if (files.length + _files.length < MIN_FILES) {
      setFileUploadError(minFileError)
      return
    }

    setFiles([...files, ..._files])
  }

  const onDragDropChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) {
      return null
    }
    const filesArray = Array.from(files)

    onMediaChange(filesArray)
  }

  const submitPassCreation = async (data: FieldValues) => {
    const passApi = new PassApi()

    if (files.length < MIN_FILES) {
      setFileUploadError(minFileError)
      return
    }
    if (files.length > MAX_FILES) {
      setFileUploadError(maxFileError)
      return
    }

    // TODO:
    // 1. allow video upload (but ensure that image also gets uploaded)
    // 2. get media type of video and image
    // 3. use type in creation

    const newPassRequestConfig = {
      title: data.passName,
      description: data.passDescription,
      freetrial: data["free-dm-month-checkbox"],
      type: newPassType(router.query.passType as string),
      price: parseInt(data.price),
      totalSupply: parseInt(data["totalSupply"]),
      messages: parseInt(data["free-dms-month"]),
      duration: DURATION,
      chain: CreatePassRequestDtoChainEnum.Sol,
      royalties: data.royalties * 100,
      imageType: CreatePassRequestDtoImageTypeEnum.Jpeg,
      accessType: CreatePassRequestDtoAccessTypeEnum.PassAccess
    }

    const passId = await passApi
      .createPass({
        createPassRequestDto: newPassRequestConfig
      })
      .then(({ passId }) => passId)
      .catch(({ message }) => toast(message))

    // setPassMedia(data.passFile, `${passId}`).catch(({ message }) =>
    //   toast(message)
    // )

    passApi
      .mintPass({
        mintPassRequestDto: {
          passId: `${passId}`
        }
      })
      .catch(({ message }) => toast(message))
  }

  const onCreatePass = handleSubmit(submitPassCreation)

  const onRemoveFileUpload = (index: number) => {
    setFiles(files.filter((_: File, i: number) => i !== index))
  }

  return {
    errors,
    files,
    fileUploadError,
    isLifetimePass,
    isSubscriptionPass,
    maximumLimit: MAX_FILES,
    onCreatePass,
    onDragDropChange,
    onRemoveFileUpload,
    register,
    getValues,
    trigger,
    isSubmitSuccessful
  }
}
