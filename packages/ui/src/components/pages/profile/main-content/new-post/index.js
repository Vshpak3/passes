import dynamic from "next/dynamic"
import AudienceChevronIcon from "public/icons/post-audience-icon.svg"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import CameraBackIcon from "public/icons/post-camera-back-icon.svg"
import InfoIcon from "public/icons/post-info-circle-icon.svg"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog } from "src/components/common/dialog"
import { FormInput } from "src/components/form/form-input"
import { classNames } from "src/helpers/classNames"

import { NewPostDropdown } from "./audience-dropdown"
import { Footer } from "./footer"
import { NewFundraiserTab } from "./fundraiser-tab"
import MediaHeader from "./header"
import UploadPostMedia from "./media"
import { PollsTab } from "./polls-tab"
import { NewsQuizTab } from "./quiz-tab"

const RecordView = dynamic(
  () =>
    import("src/components/common/media-record").then((mod) => mod.RecordView),
  {
    ssr: false
  }
)
export const NewPost = ({ passes = [] }) => {
  const [hasMounted, setHasMounted] = useState(false)
  const [files, setFiles] = useState([])
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
    control
  } = useForm({
    defaultValues: {}
  })
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const fundraiserTarget = watch("fundraiserTarget")
  const [hasSchedule, setHasSchedule] = useState(false)
  const [hasFundraiser, setHasFundraiser] = useState(false)
  const [hasVideo, setHasVideo] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)

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

  const [extended, setExtended] = useState(false)
  const [selectedPasses, setSelectedPasses] = useState([])
  const MB = 1048576
  const MAX_FILE_SIZE = 10 * MB
  const MAX_FILES = 9
  const isPaid = watch("isPaid")

  const mediaGridLayout = (length, index) => {
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

  const onSubmit = () => {
    const values = getValues()
    console.log(values)
  }

  const onFileInputChange = (event) => {
    const files = [...event.target.files]

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
          className="min-h-12 flex flex-col items-start justify-start rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-7 py-5 backdrop-blur-[100px]"
          onClick={() => setExtended(true)}
        >
          {extended && (
            <>
              <MediaHeader
                register={register}
                errors={errors}
                onChange={onMediaHeaderChange}
                activeMediaHeader={activeMediaHeader}
                hasSchedule={hasSchedule}
                hasFundraiser={hasFundraiser}
              />
              {hasSchedule === "Schedule" && <div>Schedule</div>}
              {hasVideo && (
                <Dialog
                  open={true}
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
                : "border-b border-[#2C282D]",
              "w-full"
            )}
          >
            <FormInput
              register={register}
              type="text-area"
              name="text"
              className="m-0 w-full resize-none border-transparent bg-transparent p-0 focus:border-transparent focus:ring-0"
              placeholder="What’s on your mind?"
              rows={4}
              cols={40}
            />
          </div>
          {extended && (
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
                <div className="h-[170px] w-full">
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
            </div>
          )}
          {extended && (
            <>
              {isPaid && (
                <div className="flex w-full flex-col items-start gap-[17px] border-b border-[#2C282D] p-0 pt-[53px] pb-[56px] ">
                  <span className="text-base font-normal text-[#BF7AF0]">
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
                <div className="block w-full border-b border-[#2C282D] p-0 pt-[38px] pb-7">
                  <div className="flex flex-1 items-center gap-4 pb-5">
                    <span>Paid for (if not in the audience list)</span>
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
                        className="w-full rounded-md border-[#2C282D]  bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0 "
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[6px] transition-all">
                    {selectedPasses.map((pass, index) => (
                      <div
                        key={index}
                        className="flex flex-shrink-0 animate-fade-in-down items-start gap-[10px] rounded-[56px] border border-[#2C282D] bg-[#100C11] py-[10px] px-[18px]"
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
