import { MessagesApi, PostApi } from "@passes/api-client/apis"
import React, { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { wrapApi } from "src/helpers"
import { useUser } from "src/hooks"
import { useSWRConfig } from "swr"

import { MessagesChannel } from "../molecules/direct-messages/messages-channel"
import { MessagesChannelList } from "../molecules/direct-messages/messages-channel-list"
import { MessagesPriceDialog } from "../molecules/direct-messages/messages-price-dialog"

export type List = {
  name: string
  selected: boolean
  id: number
  members: {
    selected: boolean
    id: number
    displayName: string
    avatarUrl: string
    userId: string
  }[]
}
const MOCK_DATA_LISTS = [
  {
    name: "Basic",
    selected: true,
    id: 1,
    members: [
      {
        selected: false,
        id: 1,
        displayName: "Alex Drachnik",
        avatarUrl: "",
        userId: "drachnik"
      },
      {
        selected: true,
        id: 2,
        displayName: "Zoya Ramzanli",
        avatarUrl: "",
        userId: "zoya773"
      },
      {
        selected: false,
        id: 3,
        displayName: "Berat Salija",
        avatarUrl: "",
        userId: "berat28"
      },
      {
        selected: true,
        id: 4,
        displayName: "John Wick",
        avatarUrl: "",
        userId: "John50"
      }
    ]
  },
  {
    name: "Gold",
    id: 2,
    selected: false,
    members: [
      {
        selected: false,
        id: 1,
        displayName: "Kelmend Tairi",
        avatarUrl: "",
        userId: "kel"
      },
      {
        selected: false,
        id: 2,
        displayName: "Captain America",
        avatarUrl: "",
        userId: "captain007"
      },
      {
        selected: false,
        id: 3,
        displayName: "Geralt Rivia",
        avatarUrl: "",
        userId: "gor"
      },
      {
        selected: false,
        id: 4,
        displayName: "Spider Man",
        avatarUrl: "",
        userId: "spidey"
      }
    ]
  },
  {
    name: "Plat",
    id: 3,
    selected: false,
    members: [
      {
        selected: false,
        id: 1,
        displayName: "Alex Drachnik",
        avatarUrl: "",
        userId: "drachnik"
      },
      {
        selected: false,
        id: 2,
        displayName: "Zoya Ramzanli",
        avatarUrl: "",
        userId: "zoya773"
      },
      {
        selected: false,
        id: 3,
        displayName: "Berat Salija",
        avatarUrl: "",
        userId: "berat28"
      },
      {
        selected: false,
        id: 4,
        displayName: "John Wick",
        avatarUrl: "",
        userId: "John50"
      }
    ]
  },
  {
    name: "&&&",
    id: 4,
    selected: false,
    members: [
      {
        selected: false,
        id: 1,
        displayName: "Alex Drachnik",
        avatarUrl: "",
        userId: "drachnik"
      },
      {
        selected: false,
        id: 2,
        displayName: "Zoya Ramzanli",
        avatarUrl: "",
        userId: "zoya773"
      },
      {
        selected: false,
        id: 3,
        displayName: "Berat Salija",
        avatarUrl: "",
        userId: "berat28"
      },
      {
        selected: false,
        id: 4,
        displayName: "John Wick",
        avatarUrl: "",
        userId: "John50"
      }
    ]
  },
  {
    name: "list1",
    id: 5,
    selected: false,
    members: [
      {
        selected: false,
        id: 1,
        displayName: "Alex Drachnik",
        avatarUrl: "",
        userId: "drachnik"
      },
      {
        selected: false,
        id: 2,
        displayName: "Zoya Ramzanli",
        avatarUrl: "",
        userId: "zoya773"
      },
      {
        selected: false,
        id: 3,
        displayName: "Berat Salija",
        avatarUrl: "",
        userId: "berat28"
      },
      {
        selected: false,
        id: 4,
        displayName: "John Wick",
        avatarUrl: "",
        userId: "John50"
      }
    ]
  }
]

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9
// TODO: Fix uploadFile content when change from Berat are done
// TODO: replace MOCK lists with real lists when useLists hooks ready from Dan
// TODO: Decide if we should remove upload from device at Message Input (Photos,Videos) since images come as selected from vault Aaron & Zoya
// TODO: Add selected Media from vault when they are not mock data and adaptable for MessageInput preview - Dan
// TODO: ADD Search dropdown async for lists from our date Design Feature when ready from Kristina
// TODO: Do mobile optimizations with toggle button
// TODO: return Successful Batch Message on Channel Chat Window after upper todos are done
// TODO: Add mass Direct-Message at Creator Profile and into Messages in other ticket when functionality is done

interface IDirectMessages {
  newMessage: boolean
  setNewMessage: Dispatch<SetStateAction<any>>
}
const DirectMessage = ({ newMessage, setNewMessage }: IDirectMessages) => {
  const [activeList, setActiveList] = useState<List>(MOCK_DATA_LISTS[0])
  const [selectedLists, setSelectedLists] = useState<List[]>([])
  const [hasPrice, setHasPrice] = useState(false)
  const [targetAcquired, setTargetAcquired] = useState(false)
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [files, setFiles] = useState<File[]>([])

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    watch,
    reset
  } = useForm({
    defaultValues: {}
  })
  const postPrice = watch("postPrice" as any) as unknown as number
  const { mutate } = useSWRConfig()
  const { user } = useUser()

  const onSubmit = async () => {
    // const contentApi = wrapApi(ContentApi)

    const values = getValues()
    const content = await Promise.all(
      files.map(async (file) => {
        // const url = await uploadFile(file, "uploads")
        // let contentType = file.type
        // if (file.type.startsWith("image/")) contentType = "image/jpeg"
        // if (file.type.startsWith("video/")) contentType = "video/mp4"
        // const content = await contentApi.create({
        //   CreateContentRequestDto: {
        //     url,
        //     contentType
        //   }
        // })
        // return content.id
        return file
      })
    )
    const { postId } = await createPost({ ...values, content })
    const messagesApi = wrapApi(MessagesApi)

    await messagesApi.massSend({
      createBatchMessageRequestDto: {
        listIds: [],
        // TODO: get lists and use their Ids
        passIds: [],
        postId
      }
    })
    reset()
  }

  const createPost = async (values: any) => {
    const api = wrapApi(PostApi)
    const result = await mutate(
      [`/post/creator/`, user?.username],
      async () =>
        await api.createPost({
          createPostRequestDto: {
            isMessage: true,
            price: targetAcquired ? postPrice : 0,
            contentIds: [],
            passIds: [],
            tags: [],
            text: values.text
          }
        }),
      {
        populateCache: (post, previousPosts) => {
          if (!previousPosts)
            return {
              count: 1,
              cursor: user?.username,
              posts: [post]
            }
          else
            return {
              count: previousPosts.count + 1,
              cursor: previousPosts.cursor,
              posts: [post, ...previousPosts.posts]
            }
        },
        // Since the API already gives us the updated information,
        // we don't need to revalidate here.
        revalidate: false
      }
    )
    return result.posts[0]
  }

  const onMediaHeaderChange = (event: any) => {
    if (typeof event !== "string") return onFileInputChange(event)
    switch (event) {
      case "Vault":
        setNewMessage(false)
        break
      case "Message Price":
        setHasPrice(true)
        break
      default:
        setActiveMediaHeader(event)
        break
    }
  }
  const onTargetAcquired = () => {
    setHasPrice(false)
    setTargetAcquired(true)
  }

  const onDeletePostPrice = () => {
    setHasPrice(false)
    setTargetAcquired(false)
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

  const onMediaChange = (filesProp: any) => {
    let maxFileSizeExceeded = false
    const _files = filesProp.filter((file: any) => {
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
  const onRemove = (index: any) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const onSelectList = (list: any) => {
    const listExists = selectedLists.find(
      (existingList) => existingList?.id === list.id
    )
    if (listExists === undefined) {
      const updatedList = [...selectedLists, list]
      setSelectedLists(updatedList)
    }
  }
  const onDeleteList = (listToDelete: any) => {
    const updatedList = selectedLists.filter(
      (list) => list?.id !== listToDelete.id
    )
    setSelectedLists(updatedList)
  }

  const onToggleUser = (member: any) => {
    const updatedList = {
      ...activeList,
      members: activeList.members.map((user) =>
        user.id === member?.id
          ? { ...member, selected: !member?.selected }
          : user
      )
    }
    setActiveList(updatedList)
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="-mt-56 mb-5 w-full bg-black"
    >
      <div className="flex justify-start px-8 pt-5">
        <div className="flex w-full rounded-l-[20px] rounded-r-[20px] border border-[#FFFF]/10 bg-[#1b141d]/50 ">
          <MessagesChannelList
            lists={MOCK_DATA_LISTS}
            activeList={activeList}
            setActiveList={setActiveList}
            onToggleUser={onToggleUser}
          />

          <MessagesChannel
            lists={MOCK_DATA_LISTS}
            onSelectList={onSelectList}
            selectedLists={selectedLists}
            onDeleteList={onDeleteList}
            newMessage={newMessage}
            files={files}
            register={register}
            onDragDropChange={onDragDropChange}
            onFileInputChange={onFileInputChange}
            onRemove={onRemove}
            errors={errors}
            activeMediaHeader={activeMediaHeader}
            onMediaHeaderChange={onMediaHeaderChange}
            onDeletePostPrice={onDeletePostPrice}
            targetAcquired={targetAcquired}
            postPrice={postPrice}
            setNewMessage={setNewMessage}
          />
        </div>
      </div>
      <>
        {hasPrice && (
          <MessagesPriceDialog
            register={register}
            setHasPrice={setHasPrice}
            onTargetAcquired={onTargetAcquired}
            postPrice={postPrice}
          />
        )}
      </>
    </form>
  )
}

export default DirectMessage
