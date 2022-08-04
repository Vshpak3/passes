// import { PassApi } from "@passes/api-client"
import { useRouter } from "next/router"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import DollarIcon from "public/icons/profile-dollar-icon.svg"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import {
  CoverButton,
  GradientButton,
  PassesPinkButton
} from "src/components/common/Buttons"
import UploadPostMedia from "src/components/pages/profile/main-content/new-post/media"
import { withPageLayout } from "src/components/pages/WithPageLayout"
import { FormContainer } from "src/containers"
// import useLocalStorage from "src/hooks/useLocalStorage"

const Collection = ({ options = {} }) => {
  const [hasMounted, setHasMounted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()
  // const [accessToken] = useLocalStorage("access-token", "")

  const {
    // handleSubmit,
    register,
    formState: { errors }
    // getValues,
    // setValue
  } = useForm({
    defaultValues: {}
  })

  useEffect(() => {
    setHasMounted(true)
  }, [])
  const MB = 1048576
  const MAX_FILE_SIZE = 10 * MB
  const MAX_FILES = 9

  const mediaGridLayout = (length: number, index: number) => {
    switch (length) {
      case 1:
        return "col-span-12"
      case 2:
      case 4:
        return "col-span-6"
      case 3:
        return index === 0 ? "col-span-6 row-span-2" : "col-span-6"
      case 5:
        return index === 0 || index === 1 ? "col-span-6" : "col-span-4"
      default:
        return "col-span-4"
    }
  }

  const onMediaChange = (filesArray: File[]) => {
    let maxFileSizeExceeded = false

    const _files = filesArray.filter((file: File) => {
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

  const onDragDropChange = (event: React.DragEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files
    if (!files) return null
    const filesArray = Array.from(files)

    onMediaChange(filesArray)
  }

  const onCreateHandler = () => {
    // const passApi = new PassApi()
    // passApi.passCreate(
    //   {
    //     createPassDto: {
    //       // owner: "Michael",
    //       collectionId: "test",
    //       title: "Test title",
    //       description: "test description",
    //       imageUrl: "www.google.com",
    //       type: "subscription",
    //       price: 20,
    //       totalSupply: 1000
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

  const onRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }
  if (!hasMounted) {
    return null
  } else
    return (
      <div className="mx-auto -mt-[205px] mb-[70px] grid w-full grid-cols-10 justify-center gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
        <div className="col-span-10 h-full w-full">
          <div className="text-center text-base font-medium leading-[19px]">
            <span className="text-[#ffff]/90">
              Create a new{" "}
              {router.query.passType === "subscription"
                ? "Subsciption"
                : "Limited Edition"}{" "}
              Pass
            </span>
          </div>
        </div>

        {/* Begin Pass Creation Section */}
        <div className="col-span-10 mx-auto w-full space-y-6 lg:col-span-10 lg:max-w-[680px]">
          <FormContainer>
            <span className="text-[#ffff]/90">Create New Pass</span>
            <span className="text-[#BF7AF0]">Name this pass</span>

            <FormInput
              register={register}
              type="text"
              name="pass-title"
              className="flex-grow-1 m-0 border-[#2C282D] bg-transparent p-0 text-[#ffff]/90 focus:border-transparent focus:ring-0"
              placeholder="Name of your new pass!"
            />

            <span className="text-center text-[#ffff]/90">
              Don&apos;t have art? Click to generate a pass!
            </span>
            <GradientButton name="Make sumthing purty for me!" />
            {/* End Pass Creation Section */}
            {/* Begin Artwork Upload Section */}
            <span className="text-[#ffff]/70">or Upload Artwork</span>

            <div className="h-full w-full items-center overflow-y-auto pb-5">
              {files.length === 0 ? (
                <FormInput
                  className="h-[170px]"
                  register={register}
                  name={"drag-drop"}
                  type="drag-drop-file"
                  multiple={true}
                  accept={["image", "video"]}
                  options={{ onChange: onDragDropChange }}
                  errors={errors}
                />
              ) : (
                <div className="h-[300px] w-full">
                  <div className="grid h-full grid-cols-12 gap-4">
                    {files.length > 0 &&
                      files.map((file, index) => (
                        <div
                          key={`media_${index}`}
                          className={mediaGridLayout(files.length, index)}
                        >
                          <UploadPostMedia
                            onRemove={() => onRemove(index)}
                            file={file}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <div className="my-4">
                <span className="text-[#ffff]/70">Upload Preview</span>
              </div>
            </div>
            {/* End Artwork Upload Section */}
            {/* Begin Description Section */}

            <div className="mb-4 w-full">
              <div className="mb-4">
                <span className="text-[#ffff]/70">Add description</span>
              </div>
              <FormInput
                register={register}
                type="text"
                name="pass-caption"
                className="m-0 w-full resize-none border-transparent border-[#2C282D] bg-transparent p-0 text-[#ffff]/90 focus:border-transparent focus:ring-0"
                placeholder="Type a caption here that describes the pass"
              />
            </div>
            {/* End Description Section */}

            {/* Begin Passes Limited Edition Switch Section */}
            <hr className="border-[#2C282D]" />
            <div className="flex items-center">
              <FormInput
                textPosition="left"
                label="Limited Edition"
                type="toggle"
                register={register}
                errors={errors}
                options={options}
                name="limitedEdition"
                className="group rounded-[56px] p-2 text-sm hover:bg-[rgba(191,122,240,0.1)]"
              />
              <div className="ml-4 mr-2">
                <span className="text-[#ffff]/70">How many passes</span>
              </div>
              <FormInput
                register={register}
                type="text"
                name="pass-amount"
                className="m-0 max-w-[60px] border-transparent bg-transparent p-0 text-[#ffff]/90 focus:border-transparent focus:ring-0"
                placeholder="340"
              />
            </div>
            <hr className="border-[#2C282D]" />
            {/* End Passes Limited Edition Switch Section */}
            {/* Begin Unlock Tier Section */}
            <div className="my-4 bg-[#100C11]">
              <span className="text-[#ffff]/70">
                What does this tier of pass unlock?
              </span>
              <div className="my-4 flex items-center ">
                <FormInput
                  register={register}
                  type="checkbox"
                  name="dm-checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="default-checkbox"
                  className="ml-2 text-sm font-medium text-[#ffff]/90 dark:text-gray-300"
                >
                  All Media
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <FormInput
                  register={register}
                  type="checkbox"
                  name="dm-checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="checked-checkbox"
                  className="ml-2 text-sm font-medium text-[#ffff]/90 dark:text-gray-300"
                >
                  All Stories
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <FormInput
                  register={register}
                  type="checkbox"
                  name="dm-checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="checked-checkbox"
                  className="ml-2 text-sm font-medium text-[#ffff]/90 dark:text-gray-300"
                >
                  All Live streams
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <FormInput
                  register={register}
                  type="checkbox"
                  name="dm-checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="checked-checkbox"
                  className="ml-2 text-sm font-medium text-[#ffff]/90 dark:text-gray-300"
                >
                  All Photos
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <FormInput
                  register={register}
                  type="checkbox"
                  name="dm-checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="checked-checkbox"
                  className="ml-2 text-sm font-medium text-[#ffff]/90 dark:text-gray-300"
                >
                  All Videos
                </label>
              </div>
            </div>
            {/* End Unlock Tier Section */}
            {/* Begin DM Checkbox */}
            <div>
              <span className="text-[#ffff]/70">Direct Messages</span>
              <div className="my-4 flex items-center">
                <FormInput
                  register={register}
                  label="Unlimited messages per month "
                  type="checkbox"
                  name="dm-checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
              </div>
            </div>
            {/* End DM Checkbox */}
            {/* Begin Subscription Section */}
            {router.query.passType === "subscription" && (
              <div>
                <hr className="border-[#2C282D]" />
                {/* subscription switch */}
                <div className="mt-6 flex">
                  <FormInput
                    textPosition="left"
                    label="Subscription"
                    type="toggle"
                    register={register}
                    errors={errors}
                    options={options}
                    name="isPaid"
                    className="group rounded-[56px] p-2 text-sm hover:bg-[rgba(191,122,240,0.1)]"
                  />
                  <span className="ml-4 text-[#ffff]/70">One time payment</span>
                </div>
                {/* automatic renewal time */}
                <div className="my-4 flex items-center justify-between">
                  <span className="text-[#ffff]/90">
                    Automatically renews every
                  </span>
                  <InfoIcon />

                  <FormInput
                    register={register}
                    type="select"
                    selectOptions={["test", "test2"]}
                    name="timeframe-dropdown"
                    className=" m-0 border-[#ffff] bg-transparent p-0 text-left text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
                    placeholder="Timeframe"
                  />
                  <FormInput
                    register={register}
                    type="text"
                    name="pass-cost"
                    className="m-0 border-transparent bg-transparent p-0 text-right text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
                    placeholder="340"
                    icon={<DollarIcon />}
                  />
                </div>
                <hr className="border-[#2C282D]" />
              </div>
            )}
            {/* End Subscription Section */}
            {/* Begin Create Pass Button Group */}
            <div>
              <div className="align-end my-4 flex w-full justify-end">
                <div className="w-1/4 pr-2">
                  <CoverButton name="Preview this Pass" />
                </div>
                <div className="w-1/4">
                  <PassesPinkButton name="Create" onClick={onCreateHandler} />
                </div>
              </div>
            </div>
            {/* End Create Pass Button Group */}
          </FormContainer>
        </div>
      </div>
    )
}

export default withPageLayout(Collection, { header: true })
