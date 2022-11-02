import { FC, MouseEventHandler } from "react"

type BulletItemProps = {
  isSelected: boolean
  setSelectedStep: MouseEventHandler
}

export const BulletItem: FC<BulletItemProps> = ({
  isSelected,
  setSelectedStep
}) => {
  return (
    <div
      className={`cursor-pointer ${
        isSelected ? "text-gray-500" : "text-gray-700"
      }`}
      onClick={setSelectedStep}
    >
      &bull;
    </div>
  )
}
