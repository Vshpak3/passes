import classNames from "classnames"
import React, { Dispatch, SetStateAction } from "react"

import { List } from "../../organisms/DirectMessage"
import { MessagesSearchInput } from "./messages-search-input"

interface IMessagingChannelList {
  lists: List[]
  activeList: List
  setActiveList: Dispatch<SetStateAction<any>>
  onToggleUser: (e: any, member: any) => void
}
export const MessagesChannelList = ({
  lists,
  activeList,
  setActiveList,
  onToggleUser
}: IMessagingChannelList) => {
  return (
    <div className="flex min-w-[370px] max-w-[370px] flex-col border-r border-[#FFFF]/10 p-[30px]">
      <span className="text-[16px] font-medium leading-[24px] text-white">
        Most recent lists
      </span>
      <div className="flex min-w-[335px] max-w-[335px] items-center gap-[5px] overflow-x-auto overflow-y-hidden py-8 ">
        {lists.map((list, index) => (
          <span
            key={index}
            onClick={() => setActiveList(list)}
            className={classNames(
              list.listId === activeList?.listId
                ? "bg-[#EDEDED] text-[#000]"
                : "bg-[#FFFEFF]/10 text-[#FFFF]",
              "flex w-[96px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[56px] py-[10px] text-[16px] font-bold leading-[25px]"
            )}
          >
            {list.name}
          </span>
        ))}
      </div>
      <MessagesSearchInput placeholder="Find people or lists" />
      <div className="py-6">
        <div className="w-full border-t border-[#FFFF]/10" />
      </div>
      <div className="pb-3">
        <span>Exclude people</span>
      </div>
      <MessagesSearchInput placeholder="Exclude people" />
      <div className="flex h-full w-full flex-col  overflow-auto pt-5">
        {activeList &&
          activeList.members &&
          activeList?.members.map((member, index) => (
            <div
              key={index}
              className="flex w-full cursor-pointer items-center rounded-sm py-[7px] px-[10px] hover:bg-[#ffffff]/10"
            >
              <div className="flex items-center pr-[14px]">
                <input
                  id={`member-${member.listMemberId}`}
                  name={`member-${member.displayName}`}
                  onChange={(event) =>
                    onToggleUser(event.target.checked, member)
                  }
                  type="checkbox"
                  className="focus:border-gary-300 h-4 w-4 rounded border-gray-300 bg-transparent text-pink-600 outline-0 ring-offset-0 focus:ring-transparent focus:ring-offset-0"
                />
              </div>
              <div className="item-center flex pr-[10px]">
                <img
                  width="50px"
                  height="50px"
                  className="rounded-full"
                  src={`https://www.w3schools.com/w3images/avatar1.png`}
                  alt="ProfilePhoto"
                />
              </div>
              <div className="flex flex-col items-start justify-start">
                <span>{member.displayName}</span>
                <span>{member.username}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
