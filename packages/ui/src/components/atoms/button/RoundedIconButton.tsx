import { FC } from "react"

interface RoundedIconButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  onClick: () => void
}

export const RoundedIconButton: FC<RoundedIconButtonProps> = ({
  icon: Icon,
  onClick
}) => (
  <button
    className="flex h-[60px] w-[60px] cursor-pointer select-none items-center justify-center rounded-lg bg-white p-4"
    onClick={onClick}
  >
    <Icon />
  </button>
)
