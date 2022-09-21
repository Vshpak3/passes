import { SetStateAction } from "react"

import { EventsTable } from "./EventsTable"

type PropsType = {
  setShowDeletePostModal: React.Dispatch<SetStateAction<boolean>>
}

export const ScheduledEvents = ({ setShowDeletePostModal }: PropsType) => {
  return (
    <div className="select-none py-[50px] px-[15px] md:px-[30px]">
      <div className="mb-[30px] text-base font-bold md:text-2xl">
        Scheduled Events
      </div>
      <EventsTable setShowDeletePostModal={setShowDeletePostModal} />
    </div>
  )
}
