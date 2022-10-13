import { CreatePostRequestDto, PostApi } from "@passes/api-client"
import classNames from "classnames"
import _ from "lodash"
import dynamic from "next/dynamic"
import NextImageArrow from "public/icons/next-slider-arrow.svg"
import AudienceChevronIcon from "public/icons/post-audience-icon.svg"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import PlusIcon from "public/icons/post-plus-icon.svg"
import PrevImageArrow from "public/icons/prev-slider-arrow.svg"
import { FC, MouseEvent, useState } from "react"
import { useForm } from "react-hook-form"
import Slider from "react-slick"
import { toast } from "react-toastify"
import { FormInput } from "src/components/atoms/FormInput"
import { useFormSubmitTimeout } from "src/components/messages/utils/useFormSubmitTimeout"
import { NewPostModal } from "src/components/organisms/NewPostModal"
import { PostFooter } from "src/components/organisms/profile/new-post/PostFooter"
import { PostHeader } from "src/components/organisms/profile/new-post/PostHeader"
import { ContentService } from "src/helpers/content"
import { CACHE_KEY_SCHEDULED_EVENTS } from "src/hooks/useScheduledPosts"
import { mutate } from "swr"

import { NewPostDropdown } from "./audience-dropdown"
import { MediaFile } from "./media"

const CustomMentionEditor = dynamic(
  () => import("src/components/organisms/CustomMentionEditor"),
  { ssr: false }
)

const MB = 1048576
const MAX_IMAGE_SIZE = 10 * MB
const MAX_IMAGE_SIZE_NAME = "10 megabytes"
const MAX_VIDEO_SIZE = 200 * MB
const MAX_VIDEO_SIZE_NAME = "200 megabytes"
export const MAX_IMAGE_COUNT = 10

const settings = {
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextImageArrow />,
  prevArrow: <PrevImageArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
  ]
}

interface NewPostFormProps {
  expiresAt: Date | null
  isPaid: boolean
  mentions: any[] // TODO
  passes: any[] // TODO
  price: string
  scheduledAt: Date | null
  text: string
}

interface NewPostProps {
  passes?: any
  placeholder: any
  createPost: (
    arg: CreatePostRequestDto,
    postId: string
  ) => void | Promise<void>
  onlyText?: boolean
  initialData: Record<string, any>
  isExtended?: boolean
}

export const NewPost: FC<NewPostProps> = ({
  passes = [], // TODO: use passes search bar
  placeholder,
  createPost,
  onlyText = false,
  initialData = {},
  isExtended = false
}) => {
  const [files, setFiles] = useState<File[]>([])
  const [containsVideo, setContainsVideo] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<File>()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [extended, setExtended] = useState(isExtended)
  const [isReset, setIsReset] = useState(false)
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const [selectedPasses, setSelectedPasses] = useState(passes)
  const START_SLIDER_AFTER_FILES_LENGTH = 2

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
    reset
  } = useForm<NewPostFormProps>({
    defaultValues: { ...initialData }
  })
  const { disableForm } = useFormSubmitTimeout(isSubmitting)

  const isPaid = watch("isPaid")

  const setScheduledTime = (date: Date | null) => {
    setValue("scheduledAt", date, { shouldValidate: true })
  }

  const onPassSelect = () => {
    //   const { passes: _passes } = getValues()
    //   const result = Object.keys(_passes)
    //     .filter((id) => _passes[id])
    //     .map((id) => passes.find((pass) => pass.id === id))
    //   setSelectedPasses(result)
    setSelectedPasses([])
  }

  const onMediaFileSelect = (file: File) => {
    setSelectedMedia(file)
    setIsNewPostModalOpen(true)
  }

  const removePasses = (id: any) => {
    // setValue(`passes[${id}]`, false, { shouldValidate: true })
    setSelectedPasses(selectedPasses.filter((pass: any) => pass.id !== id))
  }

  const onSubmit = async () => {
    const values = getValues()
    if (values.text.length === 0 && files.length === 0) {
      toast.error("Must add either text or content")
      return
    }
    const content = await new ContentService().uploadContent(files, undefined, {
      inPost: true,
      inMessage: false
    })
    setExtended(false)

    const post: CreatePostRequestDto = {
      text: values.text,
      tags: [], // TODO: add in values.mentions (must update to be TagDto)
      passIds: [], // TODO: add in passes
      scheduledAt: values.scheduledAt,
      expiresAt: values.expiresAt,
      price: isPaid ? parseInt(values.price) : 0,
      contentIds: content.map((c: any) => c.id)
    }

    const api = new PostApi()
    const response = await api.createPost({
      createPostRequestDto: post
    })
    const postId = response.postId

    await createPost(post, postId)
    mutate(CACHE_KEY_SCHEDULED_EVENTS)
    reset()
    setFiles([])
    setIsReset(true)
  }

  const onFileInputChange = (event: any) => {
    onMediaChange([...event.target.files])
    event.target.value = ""
  }

  const onDragDropChange = (event: any) => {
    if (event?.target?.files) {
      return onFileInputChange(event)
    }
    onMediaChange([...event.target.files])
    event.target.value = ""
  }

  const onMediaChange = (fileProps: File[]) => {
    let _containsVideo = containsVideo

    // Validate properties of each file
    for (const file of fileProps) {
      const isVideo = (file as File).type.startsWith("video/")

      const type = file.type.match(/(\w+)\/(\w+)/)?.at(1)
      if (!type || (type !== "image" && type !== "video")) {
        toast.error(`Invalid media type ${file.type}`)
        return
      }

      if (type === "video") {
        if (isVideo && files.length >= 1) {
          toast.error("A post can only contain a single video")
          return
        }
        if (files.length > 1) {
          toast.error("A post cannot contain both a video and images")
          return
        }
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error(`Videos cannot be larger than ${MAX_VIDEO_SIZE_NAME}`)
          return
        }
        _containsVideo = true
      }

      if (type === "image") {
        if (isVideo) {
          toast.error("A post cannot contain both a video and images")
          return
        }
        if (fileProps.length + files.length > MAX_IMAGE_COUNT) {
          toast.error(`Can only have a maximum of ${MAX_IMAGE_COUNT} images`)
          return
        }
        if (file.size > MAX_IMAGE_SIZE) {
          toast.error(`Images cannot be larger than ${MAX_IMAGE_SIZE_NAME}`)
          return
        }
      }
    }

    setContainsVideo(_containsVideo)

    setFiles([...files, ...fileProps])
  }

  const onRemove = (index: number, e: MouseEvent<HTMLDivElement>) => {
    const newFiles = files.filter((_, i) => i !== index)
    e.stopPropagation()
    setFiles(newFiles)
    if (newFiles.length === 0) {
      setContainsVideo(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 p-5 backdrop-blur-[100px] md:px-7 md:py-5">
        {extended && (
          <>
            <PostHeader
              title={
                Object.keys(_.omit(initialData, "scheduledAt")).length > 0
                  ? "Update Post"
                  : "New post"
              }
              onClose={() => {
                setExtended(false)
              }}
              register={register}
              errors={errors}
            />
          </>
        )}

        <div
          className={classNames("w-full", {
            "border-b border-[#2B282D] pb-6": extended
          })}
        >
          <div
            className={classNames({ "mt-4": extended }, "w-full")}
            onClick={() => {
              if (!extended) {
                setExtended(true)
              }
            }}
          >
            <CustomMentionEditor
              defaultText={initialData.text}
              isReset={isReset}
              setIsReset={setIsReset}
              placeholder={placeholder}
              onInputChange={(params: any) => {
                setValue("text", params?.text)
                setValue("mentions", params?.mentions)
              }}
            />
          </div>
          {!onlyText && extended && (
            <div className="h-full w-full items-center overflow-y-auto pt-5">
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
                <div
                  className={`${
                    files.length <= START_SLIDER_AFTER_FILES_LENGTH && "flex"
                  } w-full flex-col items-${
                    containsVideo ? "center" : "start"
                  } justify-start gap-6 overflow-hidden rounded-lg border-[1px] border-solid border-transparent p-1 sm:border-passes-secondary-color md:h-fit md:p-9`}
                >
                  {selectedMedia && (
                    <NewPostModal
                      isOpen={isNewPostModalOpen}
                      setOpen={setIsNewPostModalOpen}
                      file={selectedMedia}
                      modalContainerClassname="p-0"
                      childrenClassname="p-0"
                    />
                  )}
                  {files.length <= START_SLIDER_AFTER_FILES_LENGTH ? (
                    <div className="flex items-center justify-start gap-[7px]">
                      <div className="flex flex-nowrap items-center gap-[7px] overflow-x-auto sm:max-w-fit">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className={classNames(
                              (file as File).type.startsWith("image/")
                                ? "h-[200px] w-[130px] rounded-[6px] object-contain"
                                : (file as any).type.startsWith("video/")
                                ? "absolute inset-0 m-auto h-[334px] max-h-full min-h-full w-[250px] min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                                : (file as any).type.startsWith("audio/")
                                ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                                : "",
                              "relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px]"
                            )}
                          >
                            <MediaFile
                              onRemove={(e: MouseEvent<HTMLDivElement>) =>
                                onRemove(index, e)
                              }
                              onSelect={() => onMediaFileSelect(file)}
                              file={file}
                              iconClassName="bottom-[230px] left-[190px]"
                              className={classNames(
                                (file as File).type.startsWith("image/")
                                  ? "rounded-[6px] object-contain"
                                  : (file as any).type.startsWith("video/")
                                  ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                                  : (file as any).type.startsWith("audio/")
                                  ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                                  : ""
                              )}
                            />
                          </div>
                        ))}
                      </div>
                      {!containsVideo && files.length !== MAX_IMAGE_COUNT && (
                        <FormInput
                          register={register}
                          name="drag-drop"
                          type="file"
                          multiple={true}
                          trigger={
                            <div className="box-border flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-[50%] border border-passes-secondary-color bg-transparent">
                              <PlusIcon />
                            </div>
                          }
                          options={{ onChange: onFileInputChange }}
                          accept={[
                            ".png",
                            ".jpg",
                            ".jpeg",
                            ".mp4",
                            ".mov"
                            // ".qt"
                            // ".mp3"
                          ]}
                          errors={errors}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      <Slider
                        className="w-[320px] sm:min-w-[400px]"
                        {...settings}
                      >
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="relative left-0 flex h-[200px] max-w-[130px] flex-shrink-0 items-center overflow-hidden rounded-[6px]"
                          >
                            <MediaFile
                              onRemove={(e: MouseEvent<HTMLDivElement>) =>
                                onRemove(index, e)
                              }
                              iconClassName="bottom-[300px] left-[100px]"
                              onSelect={() => onMediaFileSelect(file)}
                              file={file}
                            />
                          </div>
                        ))}
                        <div className="absolute top-[50%] ml-[15px] translate-y-[-50%]">
                          {!containsVideo && files.length !== MAX_IMAGE_COUNT && (
                            <FormInput
                              register={register}
                              name="drag-drop"
                              type="file"
                              multiple={true}
                              trigger={
                                <div className="box-border flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-[50%] border border-passes-secondary-color bg-transparent">
                                  <PlusIcon />
                                </div>
                              }
                              options={{ onChange: onFileInputChange }}
                              accept={[
                                ".png",
                                ".jpg",
                                ".jpeg",
                                ".mp4",
                                ".mov"
                                // ".qt"
                                // ".mp3"
                              ]}
                              errors={errors}
                            />
                          )}
                        </div>
                      </Slider>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {extended && (
          <>
            {isPaid && (
              <>
                <div className="flex w-full flex-col items-start gap-[17px] border-b border-passes-dark-200 p-0 pt-[53px] pb-[56px] ">
                  <span className="text-base font-normal text-passes-secondary-color">
                    Who&apos;s is this content for?
                  </span>
                  <div className="flex flex-col items-start gap-[15px]">
                    <span className="text-small leading-[22px] text-[#FFFFFF] ">
                      These pass holders will be able to view your content for
                      free
                    </span>
                    <NewPostDropdown
                      register={register}
                      passes={passes}
                      onChange={onPassSelect}
                      dropdownVisible={dropdownVisible}
                      setDropdownVisible={setDropdownVisible}
                    />
                  </div>
                </div>
                <div className="block w-full border-b border-passes-dark-200 p-0 pt-[38px] pb-7">
                  <div className="flex flex-1 items-center gap-1 pb-5 sm:gap-4">
                    <span className="text-xs text-[#ffff] sm:text-base">
                      Price (if not an above pass holder)
                    </span>
                    <div className="relative flex max-w-[140px] justify-between rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-base font-bold text-[#ffffff]/40">
                          $
                        </span>
                      </div>
                      <FormInput
                        register={register}
                        type="number"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        min="1"
                        max="5000"
                        name="price"
                        className="w-full rounded-md border-passes-dark-200 bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[6px] transition-all">
                    {selectedPasses.map((pass: any, index: any) => (
                      <div
                        key={index}
                        className="flex flex-shrink-0 animate-fade-in-down items-start gap-[10px] rounded-[56px] border border-passes-dark-200 bg-[#100C11] py-[10px] px-[18px]"
                      >
                        <span>
                          <AudienceChevronIcon />
                        </span>
                        <span>{pass.title}</span>
                        <span>
                          <DeleteIcon onClick={() => removePasses(pass.id)} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <PostFooter
              disableForm={disableForm}
              setScheduledTime={setScheduledTime}
              scheduledTime={getValues()?.scheduledAt}
            />
          </>
        )}
      </div>
    </form>
  )
}
