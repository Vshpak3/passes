import { yupResolver } from "@hookform/resolvers/yup"
// import { PassApi } from "@passes/api-client"
import { useState } from "react"
import { useForm } from "react-hook-form"
// import useLocalStorage from "src/hooks/useLocalStorage"
import * as yup from "yup"

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES_SUBSCRIPTION = 1
const MIN_FILES_SUBSCRIPTION = 0
const MAX_FILES_LIFETIME = 5000
const MIN_FILES_LIFETIME = 10

const createPassSchema = yup.object({
  passName: yup.string().required(),
  passDescription: yup.string().required()
})

export const PassTypeEnum = {
  SUBSCRIPTION: "subscription",
  LIFETIME: "lifetime"
}

const useCreatePass = ({ passType }) => {
  const [files, setFiles] = useState([])
  const [fileUploadError, setFileUploadError] = useState(null)
  // const [accessToken] = useLocalStorage("access-token", "")
  const isLifetimePass = passType === PassTypeEnum.LIFETIME
  const isSubscriptionPass = passType === PassTypeEnum.SUBSCRIPTION

  const MAX_FILES = isLifetimePass ? MAX_FILES_LIFETIME : MAX_FILES_SUBSCRIPTION
  const MIN_FILES = isLifetimePass ? MIN_FILES_LIFETIME : MIN_FILES_SUBSCRIPTION

  const maxFileError = `Maximum upload is ${MAX_FILES} file(s).`
  const minFileError = `Minimum upload is ${MIN_FILES} file(s).`

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(createPassSchema)
  })

  const onMediaChange = (filesArray) => {
    if (fileUploadError) setFileUploadError(null)

    let maxFileSizeExceeded = false

    const _files = filesArray.filter((file) => {
      if (!MAX_FILE_SIZE) return true
      if (file.size < MAX_FILE_SIZE) return true
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

  const onDragDropChange = (event) => {
    const files = event.target.files
    if (!files) return null
    const filesArray = Array.from(files)

    onMediaChange(filesArray)
  }

  const submitPassCreation = async (data) => {
    if (files.length < MIN_FILES) {
      setFileUploadError(minFileError)
      return
    }
    if (files.length > MAX_FILES) {
      setFileUploadError(maxFileError)
      return
    }

    // TODO: use data values to post to API
    console.log({ data })

    // const passApi = new PassApi()
    // passApi.passCreate(
    //   {
    //     createPassDto: {
    //       title: params.title,
    //       description: params.description,
    //       // imageUrl: files[0].name,
    //       imageUrl:
    //         "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ellie_Goulding_-_Global_Citizen_Festival_Hamburg_07.jpg/440px-Ellie_Goulding_-_Global_Citizen_Festival_Hamburg_07.jpg",
    //       type:
    //         typeof router.query.passType === "string"
    //           ? router.query.passType
    //           : "subscription",
    //       price: parseInt(params.price),
    //       totalSupply: parseInt(params.totalSupply),
    //       duration: 2900000
    //     }
    //   },
    //   {
    //     headers: {
    //       Authorization: "Bearer " + accessToken,
    //       "Content-Type": "application/json"
    //     }
    //   }
    // )
  }

  const onCreatePass = handleSubmit((data) => submitPassCreation(data))

  const onRemoveFileUpload = (index) => {
    setFiles(files.filter((_, i) => i !== index))
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
    register
  }
}

export default useCreatePass
