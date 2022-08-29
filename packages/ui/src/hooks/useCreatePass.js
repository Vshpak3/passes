import { yupResolver } from "@hookform/resolvers/yup"
// import { PassApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
// import useLocalStorage from "src/hooks/useLocalStorage"
import * as yup from "yup"

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB

const createPassSchema = yup.object({
  passName: yup.string().required(),
  passDescription: yup.string().required(),
  royalties: yup.number().required(),
  passCost: yup.number().required()
})

export const PassTypeEnum = {
  SUBSCRIPTION: "subscription",
  LIFETIME: "lifetime"
}

const useCreatePass = () => {
  const [files, setFiles] = useState([])
  // const [accessToken] = useLocalStorage("access-token", "")
  const router = useRouter()
  const isLifetimePass = router.query.passType === PassTypeEnum.LIFETIME
  const isSubscriptionPass = router.query.passType === PassTypeEnum.SUBSCRIPTION
  const isSelectPassOption = !isLifetimePass && !isSubscriptionPass

  const MAX_FILES = isLifetimePass ? 5000 : 1

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    resolver: yupResolver(createPassSchema)
  })

  const onMediaChange = (filesArray) => {
    let maxFileSizeExceeded = false

    const _files = filesArray.filter((file) => {
      if (!MAX_FILE_SIZE) return true
      if (file.size < MAX_FILE_SIZE) return true
      maxFileSizeExceeded = true
      return false
    })

    if (maxFileSizeExceeded) {
      // TODO: show error message
    }

    if (files.length + _files.length > MAX_FILES) return // TODO: max file limit error message
    setFiles([...files, ..._files])
  }

  const onDragDropChange = (event) => {
    const files = event.target.files
    if (!files) return null
    const filesArray = Array.from(files)

    onMediaChange(filesArray)
  }

  const submitPassCreation = async (data) => {
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

  const onRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return {
    isSubscriptionPass,
    register,
    files,
    onDragDropChange,
    errors,
    onRemove,
    onCreatePass,
    isSelectPassOption,
    isLifetimePass,
    maximumLimit: MAX_FILES
  }
}

export default useCreatePass
