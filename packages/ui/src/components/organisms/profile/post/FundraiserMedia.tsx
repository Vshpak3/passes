import { FC } from "react"

interface FundraiserMediaProps {
  images: any
}

export const FundraiserMedia: FC<FundraiserMediaProps> = ({ images }) => {
  const mediaGridLayout = (length: any, index: any) => {
    switch (length) {
      case 1:
        return "col-span-12"
      case 2:
      case 4:
        return "col-span-6"
      case 3:
        return index === 0 ? "col-span-6 row-span-2" : "col-span-6"
      case 5:
        return index === 0 || index === 1 ? "col-span-6" : "col-span-4"
      default:
        return "col-span-4"
    }
  }
  return (
    <div className="relative bg-transparent">
      <div className="grid h-full grid-cols-12 gap-4">
        {images.length > 0 &&
          images.map((image: any, index: any) => (
            <div
              key={`media_${index}`}
              className={mediaGridLayout(images.length, index)}
            >
              <img
                src={image.url}
                alt={`media_${index}`}
                className="rounded-[23px] object-cover"
              />
            </div>
          ))}
      </div>
    </div>
  )
}
