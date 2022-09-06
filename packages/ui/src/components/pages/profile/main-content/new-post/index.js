import dynamic from "next/dynamic"
import AudienceChevronIcon from "public/icons/post-audience-icon.svg"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import CameraBackIcon from "public/icons/post-camera-back-icon.svg"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import PlusIcon from "public/icons/post-plus-icon.svg"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { Dialog } from "src/components/organisms"
import { classNames, Content } from "src/helpers"

import { NewPostDropdown } from "./audience-dropdown"
import { Footer } from "./footer"
import { NewFundraiserTab } from "./fundraiser-tab"
import MediaHeader from "./header"
import { MediaFile } from "./media"
import { PollsTab } from "./polls-tab"
import { NewsQuizTab } from "./quiz-tab"

const RecordView = dynamic(
  () =>
    import("src/components/organisms/media-record").then(
      (mod) => mod.RecordView
    ),
  {
    ssr: false
  }
)

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9

export const NewPost = ({
  passes = [],
  placeholder,
  createPost,
  onlyText = false
}) => {
  const [hasMounted, setHasMounted] = useState(false)
  const [files, setFiles] = useState([])
  const [selectedMedia, setSelectedMedia] = useState()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [hasSchedule, setHasSchedule] = useState(false)
  const [hasFundraiser, setHasFundraiser] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)
  const [extended, setExtended] = useState(false)
  const [selectedPasses, setSelectedPasses] = useState(passes)
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
    control,
    reset
  } = useForm({
    defaultValues: {}
  })
  const isPaid = watch("isPaid")
  const fundraiserTarget = watch("fundraiserTarget")
  const onCloseTab = (tab) => {
    switch (tab) {
      case "Fundraiser":
        setHasFundraiser(false)
        break
      case "Schedule":
        setHasSchedule(false)
        break
      default:
        setActiveMediaHeader("Media")
        break
    }
  }

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const onPassSelect = () => {
    const { passes: _passes } = getValues()
    const result = Object.keys(_passes)
      .filter((id) => _passes[id])
      .map((id) => passes.find((pass) => pass.id === id))
    setSelectedPasses(result)
  }

  const removePasses = (id) => {
    setValue(`passes[${id}]`, false, { shouldValidate: true })
    setSelectedPasses(selectedPasses.filter((pass) => pass.id !== id))
  }

  const onSubmit = async () => {
    const values = getValues()
    const content = await new Content().uploadUserContent(files)
    setExtended(false)
    createPost({ ...values, content })
    reset()
  }

  const onFileInputChange = (event) => {
    const files = [...event.target.files]
    setSelectedMedia(files[0])
    onMediaChange(files)
    event.target.value = ""
  }

  const onMediaHeaderChange = (event) => {
    if (typeof event !== "string") return onFileInputChange(event)

    switch (event) {
      case "Fundraiser":
        setHasFundraiser(true)
        break
      case "Schedule":
        setHasSchedule(true)
        break
      case "Video":
        setHasVideo(true)
        break
      case "Audio":
        setHasAudio(true)
        break
      default:
        setActiveMediaHeader(event)
        break
    }
  }

  const onDragDropChange = (event) => {
    if (event?.target?.files) return onFileInputChange(event)
    const files = [...event.target.files]

    onMediaChange(files)
    event.target.value = ""
  }

  const onMediaChange = (filesProp) => {
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

  const onRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onVideoStop = (mediaBlobUrl, blobObject, isVideo) => {
    const file = new File([blobObject], isVideo ? "test.mp4" : "test.wav", {
      type: isVideo ? "video/mp4" : "audio/wav",
      lastModified: new Date().getTime(),
      url: mediaBlobUrl
    })
    setSelectedMedia(file)
    setFiles([...files, file])
    if (hasVideo) setHasVideo(false)
    else setHasAudio(false)
  }

  if (!hasMounted) {
    return null
  } else
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-2 py-2 backdrop-blur-[100px] md:px-7 md:py-5"
          onClick={() => setExtended(true)}
        >
          {extended && (
            <>
              {!onlyText && (
                <MediaHeader
                  register={register}
                  errors={errors}
                  onChange={onMediaHeaderChange}
                  activeMediaHeader={activeMediaHeader}
                  hasSchedule={hasSchedule}
                  hasFundraiser={hasFundraiser}
                />
              )}
              {hasSchedule === "Schedule" && <div>Schedule</div>}
              {hasVideo && (
                <Dialog
                  open={true}
                  media
                  title={
                    <div className="absolute top-3 left-1 z-30 flex  items-center">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#FFFF]/10"
                        onClick={() => setHasVideo(false)}
                      >
                        <CameraBackIcon />
                      </span>
                      <span className="pl-1 text-xl font-bold text-[#FFFF]">
                        RECORD A VIDEO MESSAGE
                      </span>
                    </div>
                  }
                >
                  <div className="h-screen w-screen">
                    <RecordView
                      onStop={onVideoStop}
                      className="h-full w-full"
                    />
                  </div>
                </Dialog>
              )}
              {hasAudio && (
                <Dialog
                  open={true}
                  className="bg-transparent"
                  media
                  title={
                    <div className="absolute top-3 left-1 z-30 flex  items-center">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#FFFF]/10"
                        onClick={() => setHasAudio(false)}
                      >
                        <CameraBackIcon />
                      </span>
                      <span className="pl-1 text-xl font-bold text-[#FFFF]">
                        RECORD AN AUDIO MESSAGE
                      </span>
                    </div>
                  }
                >
                  <div className="h-screen w-screen">
                    <RecordView
                      onStop={onVideoStop}
                      className="h-full w-full"
                      options={{ video: false }}
                    />
                  </div>
                </Dialog>
              )}

              {hasFundraiser && (
                <NewFundraiserTab
                  control={control}
                  register={register}
                  fundraiserTarget={fundraiserTarget}
                  onCloseTab={onCloseTab}
                />
              )}
              {activeMediaHeader === "Quiz" && (
                <NewsQuizTab
                  control={control}
                  register={register}
                  onCloseTab={onCloseTab}
                />
              )}
              {activeMediaHeader === "Polls" && (
                <PollsTab
                  control={control}
                  register={register}
                  onCloseTab={onCloseTab}
                />
              )}
            </>
          )}
          <div
            className={classNames(
              !extended
                ? "border-none border-b-transparent"
                : "border-b border-passes-dark-200",
              "w-full"
            )}
          >
            <FormInput
              register={register}
              type="text-area"
              name="text"
              className="w-full resize-none border-transparent bg-transparent p-2 text-[#ffffff]/90 focus:border-transparent focus:ring-0 md:m-0 md:p-0"
              placeholder={placeholder}
              rows={4}
              cols={40}
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
                <div className="flex w-full flex-col items-start justify-start gap-6 overflow-hidden rounded-lg border-[1px] border-solid border-transparent p-1 sm:border-passes-secondary-color  md:h-[480px] md:p-9">
                  <div className="relative flex h-[230px] w-full items-center justify-center rounded-[6px]">
                    {selectedMedia ? (
                      <MediaFile
                        preview={true}
                        file={selectedMedia}
                        className={classNames(
                          selectedMedia?.type.startsWith("image/")
                            ? "rounded-[6px] object-contain"
                            : selectedMedia.type.startsWith("video/")
                            ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full rounded-[6px] object-cover"
                            : selectedMedia.type.startsWith("audio/")
                            ? "absolute inset-0 m-auto min-w-full max-w-full rounded-[6px] object-cover"
                            : null
                        )}
                      />
                    ) : (
                      <div className=" flex h-[232px] items-center justify-center  rounded-[6px] border-[1px] border-solid border-passes-secondary-color "></div>
                    )}
                  </div>
                  <div className="flex items-center justify-start gap-6">
                    <div className="flex max-w-[190px] flex-nowrap items-center gap-6 overflow-x-auto sm:max-w-[410px]">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative flex h-[92px] w-[118px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[6px]"
                        >
                          <MediaFile
                            onRemove={() => onRemove(index)}
                            onSelect={() => setSelectedMedia(file)}
                            file={file}
                            className={classNames(
                              file.type.startsWith("image/")
                                ? "rounded-[6px] object-contain"
                                : file.type.startsWith("video/")
                                ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                                : file.type.startsWith("audio/")
                                ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                                : null
                            )}
                          />
                        </div>
                      ))}
                    </div>
                    <FormInput
                      register={register}
                      name="drag-drop"
                      type="file"
                      multiple={true}
                      trigger={
                        <div className="box-border flex h-[92px] w-[118px] cursor-pointer items-center justify-center rounded-[6px] border-[1px] border-dashed border-passes-secondary-color bg-passes-secondary-color/10">
                          <PlusIcon />
                        </div>
                      }
                      options={{ onChange: onFileInputChange }}
                      accept={[
                        ".png",
                        ".jpg",
                        ".jpeg",
                        ".mp4",
                        ".mov",
                        ".qt",
                        ".mp3"
                      ]}
                      errors={errors}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {extended && (
            <>
              {isPaid && (
                <div className="flex w-full flex-col items-start gap-[17px] border-b border-passes-dark-200 p-0 pt-[53px] pb-[56px] ">
                  <span className="text-base font-normal text-passes-secondary-color">
                    Who’s is this content for?
                  </span>
                  <div className="flex flex-col items-start gap-[15px]">
                    <span className="text-base font-medium leading-[22px] text-[#FFFFFF] ">
                      Free content for
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
              )}
              {isPaid && (
                <div className="block w-full border-b border-passes-dark-200 p-0 pt-[38px] pb-7">
                  <div className="flex flex-1 items-center gap-1 pb-5 sm:gap-4">
                    <span className="text-xs text-[#ffff] sm:text-base">
                      Paid for (if not in the audience list)
                    </span>
                    <InfoIcon />
                    <div className="relative flex max-w-[140px] justify-between rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-base font-bold text-[#ffffff]/40">
                          $
                        </span>
                      </div>

                      <FormInput
                        register={register}
                        type="number"
                        name="price"
                        className="w-full rounded-md border-passes-dark-200  bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[6px] transition-all">
                    {selectedPasses.map((pass, index) => (
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
              )}
              <Footer />
            </>
          )}
        </div>
      </form>
    )
}
