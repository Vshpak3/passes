import { FC } from "react"

interface DeleteEventModalProps {
  onCancel: () => void
  onDelete: () => void
}

const DeleteEventModal: FC<DeleteEventModalProps> = ({
  onCancel,
  onDelete
}) => {
  return (
    <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center">
      <div className="flex w-[450px] flex-col rounded-md border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-6 py-3 backdrop-blur-md">
        <span className="mb-8 text-white">
          This will delete the post, are you sure?
        </span>
        <div className="flex w-full items-center justify-end">
          <button
            className="mr-2 rounded-[50px] bg-passes-gray-200 px-4 py-2 text-white"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-[50px] bg-passes-primary-color px-4 py-2 text-white"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteEventModal
