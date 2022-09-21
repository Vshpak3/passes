import { SetStateAction } from "react"

type PropsType = {
  setShowDeletePostModal: React.Dispatch<SetStateAction<boolean>>
}

const DeletePostModal = ({ setShowDeletePostModal }: PropsType) => {
  return (
    <div className="m-[10px] w-[500px] rounded-[20px] border border-[#ffffff26] bg-black p-[20px] text-base font-medium">
      <div className="mb-[50px]">This will delete the post, are you sure ?</div>
      <div className="flex items-center justify-end">
        <div
          className="mr-[10px] h-[45px] w-fit cursor-pointer rounded-[50px] bg-[#191919] py-[10px] px-[18px]"
          onClick={() => setShowDeletePostModal(false)}
        >
          Cancel
        </div>
        <div className="h-[45px] w-fit cursor-pointer rounded-[50px] bg-[#C943A8] py-[10px] px-[18px]">
          Delete
        </div>
      </div>
    </div>
  )
}

export default DeletePostModal
