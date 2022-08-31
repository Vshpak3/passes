import { useEffect, useState } from "react"
import { VaultFilterOption } from "src/components/atoms"
import { composeMediaFilter, composeSortKey } from "src/hooks/useVaultSort"

const DEFAULT_FILTER = "All"
const MEDIA_TYPES = [DEFAULT_FILTER, "Image", "Video", "GIF"]
const SOURCE_TYPES = [DEFAULT_FILTER, "Messages", "Posts", "Vault"]

const filterStyles = {
  media: `md:h-[28.8px] md:min-w-[61.4px] md:max-w-[76.8px]`,
  button: `md:h-[36px] md:min-w-[76.8px] md:max-w-[96px]`
}

const VaultFilterContainer = ({
  mediaContent,
  sortOrder,
  sortKey,
  setFilteredItems
}) => {
  const [activeMediaFilter, setActiveMediaFilter] = useState(DEFAULT_FILTER)
  const [activeSourceFilter, setActiveSourceFilter] = useState(DEFAULT_FILTER)

  useEffect(() => {
    const filteredMedia = mediaContent
      .filter(composeMediaFilter(activeMediaFilter, "type"))
      .filter(composeMediaFilter(activeSourceFilter, "source"))

    const sortedMedia = filteredMedia?.sort(composeSortKey(sortKey, sortOrder))

    setFilteredItems(sortedMedia)
  }, [
    activeMediaFilter,
    activeSourceFilter,
    mediaContent,
    setFilteredItems,
    sortKey,
    sortOrder
  ])

  return (
    <div className="items-align align-center my-6 flex md:my-0">
      <div className="align-items flex w-full flex-col justify-start md:mt-5">
        <div className="mb-[15px] flex items-start md:mb-[20px]">
          {SOURCE_TYPES.map((source, index) => {
            const isActive = source === activeSourceFilter
            const onClick = () => setActiveSourceFilter(source)
            return (
              <VaultFilterOption
                buttonStyle={filterStyles.source}
                onClick={onClick}
                key={index}
                isActive={isActive}
                label={source}
              />
            )
          })}
        </div>
        <div className="mb-[15px] flex items-center md:mb-[20px]">
          {MEDIA_TYPES.map((media, index) => {
            const isActive = media === activeMediaFilter
            const onClick = () => setActiveMediaFilter(media)
            return (
              <VaultFilterOption
                buttonStyle={filterStyles.media}
                onClick={onClick}
                key={index}
                isActive={isActive}
                label={media}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { VaultFilterContainer }
