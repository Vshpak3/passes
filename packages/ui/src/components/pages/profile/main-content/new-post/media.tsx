import Image from "next/image"
import Cross from "src/icons/cross"

type UploadPostMediaProps = {
  file: File
  onRemove: () => void
}

const UploadPostMedia = ({ file, onRemove }: UploadPostMediaProps) => (
  <div className="relative h-full w-full overflow-hidden rounded-[20px]">
    {file.type.startsWith("video/") ? (
      <video
        className="absolute inset-0 m-auto max-h-full min-h-full min-w-full max-w-full object-cover"
        src={URL.createObjectURL(file)}
        width="0px"
        height="0px"
        controls
      />
    ) : (
      <Image
        alt=""
        layout="fill"
        src={URL.createObjectURL(file)}
        objectFit="cover"
      />
    )}
    <div
      onClick={onRemove}
      className="absolute top-1 left-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(0,0,0,0.75)] p-2 text-white"
    >
      <Cross className="h-full w-full" />
    </div>
  </div>
)

export default UploadPostMedia
