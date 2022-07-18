import { Dialog, Transition } from "@headlessui/react"
import { ReactNodeLike } from "prop-types"
import { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import useUser from "src/hooks/useUser"

import { FormInput } from "../../../../form/form-input"
import MediaHeader from "./header"
import UploadPostMedia from "./media"

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

export const NewPostDialog = ({
  trigger,
  triggerClassName
}: {
  trigger: ReactNodeLike
  triggerClassName?: string
}) => {
  const { user }: { user: any } = useUser()
  const userId = user?.id as string
  const [loading, setLoading] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const {
    handleSubmit,
    register,
    // getValues,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {}
  })

  const onRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onClose = () => {
    setFiles([])
    setIsOpen(false)
    reset()
  }

  const onMediaChange = (filesProp: File[]) => {
    let maxFileSizeExceeded = false
    const _files = filesProp.filter((file) => {
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

  const onFileInputChange = (event: any) => {
    const files = [...event.target.files]

    onMediaChange(files)

    event.target.value = ""
  }

  const onDragDropChange = (event: any) => {
    if (event?.target?.files) return onFileInputChange(event)

    const files = [...event.target.files]

    onMediaChange(files)

    event.target.value = ""
  }

  const generateFilePath = (userId: string, file: File) => {
    return `${userId}/${file.name}`
  }

  const onSubmit = async () => {
    setLoading(true)
    // const { isPaid, caption } = getValues()
    try {
      await Promise.all(
        files.map((file: any) => {
          const path = generateFilePath(userId, file)
          const url = process.env.NEXT_PUBLIC_CONTENT_BASE_URL + "/" + path

          // TODO: Upload file functionality
          return url
          return fetch(url, {
            method: "PUT",
            credentials: "include",
            body: file
          })
        })
      )

      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <button className={triggerClassName} onClick={() => setIsOpen(true)}>
        {trigger}
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          open={isOpen}
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center text-center md:px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-[rgba(27, 20, 29, 0.5)] border-1 h-screen w-screen transform overflow-hidden border-white/[0.15] p-6 text-left align-middle shadow-xl backdrop-blur-[100px] transition-all md:max-h-[580px] md:max-w-[580px] md:rounded-2xl lg:max-w-[680px]">
                  <form
                    className="flex h-full flex-col justify-between"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Dialog.Title>
                      <MediaHeader
                        register={register}
                        errors={errors}
                        onChange={onFileInputChange}
                      />
                    </Dialog.Title>
                    <div className="h-full items-center overflow-y-auto">
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
                                  className={mediaGridLayout(
                                    files.length,
                                    index
                                  )}
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
                      <FormInput
                        register={register}
                        name="caption"
                        type="text-area"
                        errors={errors}
                        placeholder="Caption..."
                        rows={3}
                        className="mt-4 resize-none border-none bg-inherit focus:border-none focus:shadow-none focus:outline-none focus:ring-0 sm:text-sm"
                      />
                    </div>
                    {loading && <p>Loading...</p>}
                    <div className="mt-2 self-end">
                      <button
                        className="w-32 rounded-[50px] bg-[#C943A8] p-4"
                        type="submit"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
