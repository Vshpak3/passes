import {
  GetListMembersRequestDtoOrderTypeEnum,
  GetListsRequestsDtoOrderTypeEnum
} from "@passes/api-client"
import { ListApi, MessagesApi } from "@passes/api-client/apis"
import { useRouter } from "next/router"
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { ContentService } from "src/helpers"
import { useUser } from "src/hooks"

import { MessagesChannel } from "../molecules/direct-messages/messages-channel"
import { MessagesChannelList } from "../molecules/direct-messages/messages-channel-list"
import { MessagesPriceDialog } from "../molecules/direct-messages/messages-price-dialog"

export type List = {
  name: string
  listId: string
  type: string
  members?: {
    displayName?: string
    userId: string
    username: string
    listMemberId: string
  }[]
}

const MB = 1048576
const MAX_FILE_SIZE = 10 * MB
const MAX_FILES = 9
// TODO: Do mobile optimizations with toggle button
// TODO: return Successful Batch Message on Channel Chat Window after upper todos are done
// TODO: Add mass Direct-Message at Creator Profile and into Messages in other ticket when functionality is done

interface IDirectMessages {
  newMessage: boolean
  setNewMessage: Dispatch<SetStateAction<any>>
  vaultContentIds: string[]
}
const DirectMessage = ({
  newMessage,
  setNewMessage,
  vaultContentIds
}: IDirectMessages) => {
  const [lists, setLists] = useState<Array<any>>([])
  const [activeList, setActiveList] = useState<any>({ name: "initial" })
  const [selectedLists, setSelectedLists] = useState<List[]>([])
  const [hasPrice, setHasPrice] = useState(false)
  const [targetAcquired, setTargetAcquired] = useState(false)
  const [activeMediaHeader, setActiveMediaHeader] = useState("Media")
  const [files, setFiles] = useState<File[]>([])
  const [listDropdownVisible, setListDropdownVisible] = useState(false)
  const [contentIds, setContentIds] = useState<any>(vaultContentIds)
  const [excludedListIds, setExcludedListIds] = useState<any>([])
  const listApi = useMemo(() => new ListApi(), [])
  const { user } = useUser()
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    watch
  } = useForm({
    defaultValues: {
      text: "",
      postPrice: "0"
    }
  })
  const postPrice = watch("postPrice")

  const fetchList = useCallback(async () => {
    if (lists.length > 0) return
    try {
      const allLists: any = await listApi.getLists({
        getListsRequestsDto: {
          order: "desc",
          orderType: GetListsRequestsDtoOrderTypeEnum.CreatedAt
        }
      })

      setLists(allLists.lists)
    } catch (error) {
      console.error(error)
    }
  }, [listApi, lists])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const fetchActiveListMembers = useCallback(async () => {
    if (activeList.name === "initial") return
    try {
      const activeListMembers: any = await listApi.getListMembers({
        getListMembersRequestDto: {
          order: "desc",
          orderType: GetListMembersRequestDtoOrderTypeEnum.CreatedAt,
          listId: activeList?.listId
        }
      })

      setActiveList({
        ...activeList,
        members: [...activeListMembers.listMembers]
      })
    } catch (error) {
      console.error(error)
    }
    // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [listApi, activeList.name])

  useEffect(() => {
    fetchActiveListMembers()
    // eslint-disable-next-line no-use-before-define, react-hooks/exhaustive-deps
  }, [fetchActiveListMembers])

  const mergeContentIds = (uploadedContentIds: (string | undefined)[]) => {
    return [...contentIds, ...uploadedContentIds]
  }

  const onSubmit = async () => {
    const messagesApi = new MessagesApi()
    const listIds = selectedLists.map((s) => s.listId)
    const content = await new ContentService().uploadContent(files)
    const uploadedContentIds = content.map((c) => c.id)
    const values = getValues()
    const _contentIds = mergeContentIds(uploadedContentIds)

    await messagesApi.massSend({
      createBatchMessageRequestDto: {
        includeListIds: listIds,
        excludeListIds: excludedListIds,
        passIds: [],
        contentIds: _contentIds || [],
        text: values?.text || "",
        price: values.postPrice ? parseInt(values.postPrice) : 0
      }
    })
  }

  const onMediaHeaderChange = (event: any) => {
    if (typeof event !== "string") return onFileInputChange(event)
    switch (event) {
      case "Vault":
        router.push(
          {
            pathname: "/tools/vault"
          },
          "/tools/vault"
        )
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
    setContentIds(contentIds.filter((_: any, i: any) => i !== index))
  }

  const onSaveLists = (updatedLists: List[]) => {
    setSelectedLists(updatedLists)
    setListDropdownVisible(false)
  }
  const onDeleteList = (listToDelete: any) => {
    const updatedList = selectedLists.filter(
      (list) => list?.listId !== listToDelete.listId
    )
    setSelectedLists(updatedList)
  }

  const onToggleUser = (checked: any, member: any) => {
    if (checked) {
      const memberExists = excludedListIds.find(
        (existingMember: { listMemberId: any }) =>
          existingMember === member.listMemberId
      )
      if (memberExists === undefined) {
        const updatedExcludedMembersList = [
          ...excludedListIds,
          member.listMemberId
        ]
        setExcludedListIds(updatedExcludedMembersList)
      }
    } else if (!checked) {
      const removeFromList = excludedListIds.filter(
        (exists: any) => exists !== member.listMemberId
      )
      setExcludedListIds(removeFromList)
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-screen w-full bg-black"
    >
      <div className="flex h-full justify-start">
        <div className="flex h-full w-full border border-[#FFFF]/10 bg-[#120C14] ">
          <MessagesChannelList
            lists={lists}
            activeList={activeList}
            setActiveList={setActiveList}
            onToggleUser={onToggleUser}
          />
          <MessagesChannel
            lists={lists}
            onSaveLists={onSaveLists}
            selectedLists={selectedLists}
            onDeleteList={onDeleteList}
            newMessage={newMessage}
            files={files}
            contentIds={contentIds}
            register={register}
            onFileInputChange={onFileInputChange}
            onRemove={onRemove}
            errors={errors}
            activeMediaHeader={activeMediaHeader}
            onMediaHeaderChange={onMediaHeaderChange}
            onDeletePostPrice={onDeletePostPrice}
            targetAcquired={targetAcquired}
            postPrice={postPrice}
            setNewMessage={setNewMessage}
            user={user}
            listDropdownVisible={listDropdownVisible}
            setListDropdownVisible={setListDropdownVisible}
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
