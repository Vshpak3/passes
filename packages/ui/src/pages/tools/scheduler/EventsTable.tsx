import { SetStateAction } from "react"

import EventsTableDesktop from "./EventsTableDesktop"
import EventsTableMobile from "./EventsTableMobile"

type PropsType = {
  setShowDeletePostModal: React.Dispatch<SetStateAction<boolean>>
}

const EventsTable = ({ setShowDeletePostModal }: PropsType) => {
  return (
    <>
      <div className="hidden md:block">
        <EventsTableDesktop setShowDeletePostModal={setShowDeletePostModal} />
      </div>
      <div className="block md:hidden">
        <EventsTableMobile setShowDeletePostModal={setShowDeletePostModal} />
      </div>
    </>
  )
}

export default EventsTable
