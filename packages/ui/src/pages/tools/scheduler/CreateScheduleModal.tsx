import ClickAwayListener from "@mui/material/ClickAwayListener"

import { SchedulerDateAndTimePicker } from "./SchedulerDateAndTimePicker"

export const CreateScheduleModal = ({ setShowCreateScheduleModal }: any) => {
  return (
    <ClickAwayListener onClickAway={() => setShowCreateScheduleModal(false)}>
      <div className="bg-[rgba(27, 20, 29, 0.5)] absolute right-[30px] top-[110px] z-50 w-10/12 rounded-[20px] border border-[#ffffff26] py-[25px] px-[30px] backdrop-blur-[100px] sm:w-[460px]">
        <div className="mb-[15px] text-base font-medium">Create Schedule</div>
        <div className="text-[#BF7AF0]">
          Please choose a date and time for your action to be executed.
        </div>
        <div className="my-[30px] mx-[0px] flex justify-center">
          <SchedulerDateAndTimePicker />
        </div>
        <div className="flex items-center justify-end">
          <div
            className="mr-[10px] h-[45px] w-fit cursor-pointer rounded-[50px] bg-[#191919] py-[10px] px-[18px]"
            onClick={() => setShowCreateScheduleModal(false)}
          >
            Cancel
          </div>
          <div className="h-[45px] w-fit cursor-pointer rounded-[50px] bg-[#C943A8] py-[10px] px-[18px]">
            Create
          </div>
        </div>
      </div>
    </ClickAwayListener>
  )
}
