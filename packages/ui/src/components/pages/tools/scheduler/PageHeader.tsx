import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import PlusQuareIcon from "public/icons/plus-square.svg"
import { FC, useCallback, useRef, useState } from "react"
import { CreateSchedulerPopup } from "src/components/pages/tools/scheduler"

export const SchedulerPageHeader: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const popperContainerRef = useRef<HTMLDivElement | null>(null)

  const open = Boolean(anchorEl)
  const id = open ? "simple-popper" : undefined

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const dismissPopper = useCallback(() => {
    anchorEl && setAnchorEl(null)
  }, [anchorEl])

  return (
    <div className="flex w-full justify-end">
      <button
        className="flex appearance-none items-center gap-2 rounded-[50px] bg-passes-primary-color py-[10px] px-[30px] text-white"
        onClick={handleClick}
      >
        <PlusQuareIcon />
        <span>Schedule</span>
      </button>
      {/* overlay to dismiss the popper */}
      {anchorEl && (
        <div
          className="bg-black-100 fixed top-0 left-0 h-screen w-full"
          onClick={dismissPopper}
        />
      )}
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        placement="bottom-end"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 17]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div
              ref={popperContainerRef}
              className="rounded-[8px] border border-passes-gray-300 bg-passes-gray-200 py-9 px-10"
            >
              <CreateSchedulerPopup onCancel={dismissPopper} />
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  )
}
