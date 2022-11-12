import { ContentDto } from "@passes/api-client"
import { FC, useEffect } from "react"

import { useContent } from "src/hooks/profile/useContent"
import { VaultMediaItem } from "./VaultMediaItem"

export interface VaultMediaItemCachedProps {
  content: ContentDto
  selectedItems: ContentDto[]
  setSelectedItems: (items: ContentDto[]) => void
  isMaxFileCountSelected: boolean
  handleClickOnItem: (item: ContentDto) => void
}

export const VaultMediaItemCached: FC<VaultMediaItemCachedProps> = ({
  content,
  ...res
}: VaultMediaItemCachedProps) => {
  const { content: cachedContent, update } = useContent(content.contentId)
  useEffect(() => {
    if (!cachedContent) {
      update(content)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedContent])

  return <VaultMediaItem content={cachedContent ?? content} {...res} />
}

export default VaultMediaItemCached // eslint-disable-line import/no-default-export
