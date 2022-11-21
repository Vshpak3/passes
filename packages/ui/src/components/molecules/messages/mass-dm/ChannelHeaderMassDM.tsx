import { FC, useCallback } from "react"

import { MassDmSelectionProps } from "src/components/organisms/messages/MessagesMassDMView"
import { SelectedBadge } from "./SelectedBadge"

type ChannelHeaderProps = MassDmSelectionProps

export const ChannelHeaderMassDM: FC<ChannelHeaderProps> = ({
  includedPasses,
  setIncludedPasses,
  excludedPasses,
  setExcludedPasses,
  includedLists,
  setIncludedLists,
  excludedLists,
  setExcludedLists
}) => {
  const removeIncludedPass = useCallback(
    (idToRemove: string) => {
      setIncludedPasses((state) =>
        state.filter((pass) => pass.passId !== idToRemove)
      )
    },

    [setIncludedPasses]
  )
  const removeIncludedList = useCallback(
    (idToRemove: string) => {
      setIncludedLists((state) =>
        state.filter((list) => list.listId !== idToRemove)
      )
    },

    [setIncludedLists]
  )
  const removeExludedPass = useCallback(
    (idToRemove: string) => {
      setExcludedPasses((state) =>
        state.filter((pass) => pass.passId !== idToRemove)
      )
    },

    [setExcludedPasses]
  )
  const removeExcludedList = useCallback(
    (idToRemove: string) => {
      setExcludedLists((state) =>
        state.filter((list) => list.listId !== idToRemove)
      )
    },

    [setExcludedLists]
  )
  return (
    <div className="flex flex-col items-start bg-[#12070E]/50 backdrop-blur-[50px]">
      <div className="flex min-h-[80px] w-full flex-row items-center gap-5 border-b border-passes-gray px-5 py-4 pr-10">
        <span className="text-[16px] font-medium leading-[24px] text-white">
          Selected audience
        </span>
        <div className="flex gap-[10px]">
          {includedLists.map((list) => (
            <SelectedBadge
              id={list.listId}
              key={list.listId}
              name={list.name ?? ""}
              removeProp={removeIncludedList}
              type="list"
            />
          ))}
          {includedPasses.map((pass) => (
            <SelectedBadge
              id={pass.passId}
              key={pass.passId}
              name={pass.title}
              removeProp={removeIncludedPass}
              type="pass"
            />
          ))}
        </div>
      </div>
      <div className="flex min-h-[80px] w-full flex-row items-center gap-5 border-b border-passes-gray px-5 py-4 pr-10">
        <span className="text-[16px] font-medium leading-[24px] text-white">
          Excluded audience
        </span>
        <div className="flex gap-[10px]">
          {excludedLists.map((list) => (
            <SelectedBadge
              id={list.listId}
              key={list.listId}
              name={list.name ?? ""}
              removeProp={removeExcludedList}
              type="list"
            />
          ))}
          {excludedPasses.map((pass) => (
            <SelectedBadge
              id={pass.passId}
              key={pass.passId}
              name={pass.title}
              removeProp={removeExludedPass}
              type="list"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
