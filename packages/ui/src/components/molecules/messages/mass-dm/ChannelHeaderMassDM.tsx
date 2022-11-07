import { ListDto, PassDto } from "@passes/api-client"
import DeleteIcon from "public/icons/badge-delete-icon.svg"
import ListIcon from "public/icons/messages-list-icon.svg"
import PassIcon from "public/icons/messages-pass-icon.svg"
import React, { Dispatch, FC, SetStateAction, useCallback } from "react"

interface SelectedBadgeProps {
  type: string
  name: string
  removeProp: (id: string) => void
  id: string
}

const SelectedBadge: FC<SelectedBadgeProps> = ({
  type,
  name,
  removeProp,
  id
}) => {
  return (
    <div className="flex items-start gap-[10px] rounded-md border border-[#2C282D] p-[10px]">
      {type === "pass" ? <PassIcon /> : <ListIcon />}
      <span className="text-[16px] font-medium leading-[24px] text-white">
        {name}
      </span>
      <DeleteIcon onClick={() => removeProp(id)} />
    </div>
  )
}

interface ChannelHeaderProps {
  selectedLists: ListDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedPasses: PassDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
}

export const ChannelHeaderMassDM: FC<ChannelHeaderProps> = ({
  selectedPasses,
  setSelectedPasses,
  selectedLists,
  setSelectedLists,
  excludedLists,
  setExcludedLists
}) => {
  const removePass = useCallback(
    (idToRemove: string) => {
      setSelectedPasses((state) =>
        state.filter((pass) => pass.passId !== idToRemove)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const removeList = useCallback(
    (idToRemove: string) => {
      setSelectedLists((state) =>
        state.filter((list) => list.listId !== idToRemove)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const removeExcludedList = useCallback(
    (idToRemove: string) => {
      setExcludedLists((state) =>
        state.filter((list) => list.listId !== idToRemove)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return (
    <div className="flex flex-col items-start bg-[#12070E]/50 backdrop-blur-[50px]">
      <div className="flex min-h-[80px] w-full flex-row items-center gap-5 border-b border-[#fff]/10 px-5 py-4 pr-10">
        <span className="text-[16px] font-medium leading-[24px] text-white">
          Selected audience
        </span>
        <div className="flex gap-[10px]">
          {selectedLists.map((list) => (
            <SelectedBadge
              id={list.listId}
              key={list.listId}
              name={list.name}
              removeProp={removeList}
              type="list"
            />
          ))}
          {selectedPasses.map((pass) => (
            <SelectedBadge
              id={pass.passId}
              key={pass.passId}
              name={pass.title}
              removeProp={removePass}
              type="pass"
            />
          ))}
        </div>
      </div>
      <div className="flex min-h-[80px] w-full flex-row items-center gap-5 border-b border-[#fff]/10 px-5 py-4 pr-10">
        <span className="text-[16px] font-medium leading-[24px] text-white">
          Excluded audience
        </span>
        <div className="flex gap-[10px]">
          {excludedLists.map((list) => (
            <SelectedBadge
              id={list.listId}
              key={list.listId}
              name={list.name}
              removeProp={removeExcludedList}
              type="list"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
