import { GetUserResponseDto } from "@passes/api-client"
import classNames from "classnames"
import UsersIcon from "public/icons/messages-users-icon.svg"
import DeleteIcon from "public/icons/messages-x-icon.svg"
import PlusIcon from "public/icons/post-plus-icon.svg"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import React, { Dispatch, SetStateAction } from "react"
import { FormInput } from "src/components/atoms"
import MediaHeader from "src/components/pages/profile/main-content/new-post/header"
import {
  Media,
  MediaFile
} from "src/components/pages/profile/main-content/new-post/media"
import { formatCurrency } from "src/helpers"

import { List } from "../../organisms/DirectMessage"
import { ListsDropdown } from "./messages-lists-dropdown"

interface File {
  type: string
}
interface IMessagesChanel {
  lists: List[]
  onSelectList: Dispatch<SetStateAction<any>>
  selectedLists: List[]
  onDeleteList: (selectedList: any) => void
  newMessage: boolean
  setNewMessage: Dispatch<SetStateAction<any>>
  files: File[]
  register: any
  onFileInputChange: (event: any) => void
  onRemove: (index: any) => void
  errors: any
  activeMediaHeader: string
  onMediaHeaderChange: Dispatch<SetStateAction<any>>
  onDeletePostPrice: () => void
  targetAcquired: boolean
  postPrice: any
  contentIds: string[]
  user?: GetUserResponseDto
}
export const MessagesChannel = ({
  lists,
  onSelectList,
  selectedLists,
  onDeleteList,
  newMessage,
  setNewMessage,
  files,
  register,
  onFileInputChange,
  onRemove,
  errors,
  activeMediaHeader,
  onMediaHeaderChange,
  onDeletePostPrice,
  targetAcquired,
  postPrice,
  contentIds,
  user
}: IMessagesChanel) => {
  return (
    <div className="flex w-full flex-col items-center justify-between ">
      <div className="flex w-full items-center justify-start gap-5 border-b border-[#FFFF]/10 py-[18px] pl-5">
        <span className="flex flex-shrink-0 items-center">
          <ListsDropdown lists={lists} onSelectList={onSelectList} />
        </span>
        <div className="flex flex-nowrap items-center gap-[10px] overflow-x-auto">
          {selectedLists?.map((selectedList, index) => (
            <div
              key={index}
              className="flex flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border border-[#2C282D] bg-[#ffff]/10 p-2 py-1"
            >
              <UsersIcon />
              <span className="pl-[8px] pr-5 text-[16px] font-bold leading-[25px] text-white">
                {selectedList.name}
              </span>
              <DeleteIcon onClick={() => onDeleteList(selectedList)} />
            </div>
          ))}
        </div>
        <div
          className="float-right ml-auto flex justify-end"
          onClick={() => setNewMessage(!newMessage)}
        >
          <CloseIcon
            className="mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-[#ffffff]/30 stroke-2 "
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="flex h-full w-full bg-black "></div>
      <div className="flex w-full flex-col border-t border-[#FFFF]/10 bg-black ">
        {(files.length > 0 || contentIds) && (
          <div className="h-full w-full items-center overflow-y-auto pt-1">
            <div className="flex w-full flex-col items-start justify-start gap-6 overflow-hidden rounded-lg border-[1px] border-solid border-transparent p-1">
              <div className="flex items-center justify-start gap-6">
                <div className="flex max-w-[190px] flex-nowrap items-center gap-6 overflow-x-auto md:max-w-[550px]">
                  {contentIds.map((contentId, index) => (
                    <div
                      key={index}
                      className="relative flex h-[66px] w-[79px] flex-shrink-0 items-center justify-center rounded-[6px]"
                    >
                      <Media
                        onRemove={() => onRemove(index)}
                        src={`${process.env.NEXT_PUBLIC_CDN_URL}media/${user?.id}/${contentId}.jpeg`}
                        // className="cursor-pointer rounded-[6px] object-contain"
                        type="image"
                        // TODO:this logic should be done on backend
                      />
                    </div>
                  ))}
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative flex h-[66px] w-[79px] flex-shrink-0 items-center justify-center rounded-[6px]"
                    >
                      <MediaFile
                        onRemove={() => onRemove(index)}
                        file={file as any}
                        className={classNames(
                          file?.type.startsWith("image/")
                            ? "cursor-pointer rounded-[6px] object-contain"
                            : file.type.startsWith("video/")
                            ? "absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                            : file.type.startsWith("audio/")
                            ? "absolute inset-0 m-auto min-w-full max-w-full cursor-pointer rounded-[6px] object-cover"
                            : ""
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
                    <div className="box-border flex h-[66px] w-[79px]  items-center justify-center rounded-[6px] border-[1px] border-dashed border-passes-secondary-color bg-passes-secondary-color/10">
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
          </div>
        )}
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <MediaHeader
              messages={true}
              activeMediaHeader={activeMediaHeader}
              register={register}
              errors={errors}
              onChange={onMediaHeaderChange}
            />
          </div>
          {targetAcquired && (
            <div className="flex h-full w-full cursor-pointer items-start justify-end gap-2 pt-4 pr-2">
              <span className="text-base font-medium  text-[#ffff]">
                Price {formatCurrency(postPrice)}
              </span>
              <DeleteIcon
                className="mt-1 mr-1"
                onClick={() => onDeletePostPrice()}
              />
            </div>
          )}
        </div>
        <div className="-mt-5 border-none pl-4 pt-4">
          <FormInput
            register={register}
            type="text-area"
            name="text"
            className="w-full resize-none border-transparent bg-transparent p-2 text-[#ffffff]/90 placeholder:text-[16px] focus:border-transparent focus:ring-0 md:m-0 md:p-0"
            placeholder="Type something for everyone.."
            rows={4}
            cols={40}
          />
        </div>
        <div className="flex w-full justify-end border border-[#ffffff]/10  py-5 pr-5">
          <div
            className="opacity-80 transition-opacity ease-in-out hover:opacity-100 "
            role="button"
            aria-roledescription="button"
          >
            <button
              type="submit"
              className="cursor-pointer gap-[10px] rounded-[50px] bg-passes-dark-200 px-[18px] py-[10px] text-white"
            >
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
