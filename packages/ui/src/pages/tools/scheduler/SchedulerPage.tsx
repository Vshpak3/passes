import { useCallback, useState } from "react"

import Calendar from "./Calendar"
// import { DeletePostModal } from "./DeletePostModal"
// import { ModalOverlay } from "./ModalOverlay"
// import { ScheduledEvents } from "./ScheduledEvents"
import SchedulerHeader from "./SchedulerHeader"

const today = new Date()

const SchedulerPage = () => {
  // const [showDeletePostModal, setShowDeletePostModal] = useState(false)
  const [month, setMonth] = useState<number>(today.getMonth())
  const [year, setYear] = useState<number>(today.getFullYear())

  const handleChangeTime = useCallback((newMonth: number, newYear: number) => {
    setMonth(newMonth)
    setYear(newYear)
  }, [])

  return (
    <div className="bg-black">
      <SchedulerHeader
        onChangeTime={handleChangeTime}
        availableFrom={{ month: 6, year: 2021 }}
      />
      <Calendar month={month} year={year} />
      {/* {showDeletePostModal && (
        <ModalOverlay>
          <DeletePostModal setShowDeletePostModal={setShowDeletePostModal} />
        </ModalOverlay>
      )}
      <ScheduledEvents setShowDeletePostModal={setShowDeletePostModal} /> */}
    </div>
  )
}

export default SchedulerPage
