import { MouseEventHandler } from "react"

type BulletItemProps = {
  isSelected: boolean
  setSelectedStep: MouseEventHandler
}

function BulletItem({ isSelected, setSelectedStep }: BulletItemProps) {
  return (
    <div
      onClick={setSelectedStep}
      className={`cursor-pointer ${
        isSelected ? "text-gray-500" : "text-gray-700"
      }`}
    >
      &bull;
    </div>
  )
}

export default BulletItem
