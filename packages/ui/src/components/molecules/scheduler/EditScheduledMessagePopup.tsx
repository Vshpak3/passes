import { ScheduledEventDto } from "@passes/api-client"
import { FC } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { MessagesMassDMView } from "src/components/organisms/messages/MessagesMassDMView"
import { ContentFilesFromBare } from "src/hooks/useMedia"
import { useUpdateScheduledEvent } from "src/hooks/useUpdateScheduledEvent"

interface EditScheduledMessagePopupProps {
  isOpen: boolean
  onCancel: () => void
  scheduledEvent: ScheduledEventDto
}

export const EditScheduledMessagePopup: FC<EditScheduledMessagePopupProps> = ({
  isOpen,
  onCancel,
  scheduledEvent
}) => {
  const { update } = useUpdateScheduledEvent()

  const {
    batchMessage,
    contents,
    scheduledEventId,
    passes,
    lists,
    type,
    scheduledAt
  } = scheduledEvent
  const {
    text,
    previewIndex,
    price,
    includeListIds,
    excludeListIds,
    includePassIds,
    excludePassIds
  } = batchMessage ?? {}
  const includeListSet = new Set(includeListIds)
  const excludeListSet = new Set(excludeListIds)
  const includePassSet = new Set(includePassIds)
  const excludePassSet = new Set(excludePassIds)
  return (
    <Dialog
      className="w-screen overflow-auto border-[0.5px] border-passes-gray-600 transition-all md:max-h-[80vh] md:max-w-[80%] lg:max-w-[60%]"
      onClose={onCancel}
      open={isOpen}
      transition={false}
    >
      <MessagesMassDMView
        initExcludedLists={lists?.filter((list) =>
          excludeListSet.has(list.listId)
        )}
        initExcludedPasses={passes?.filter((pass) =>
          excludePassSet.has(pass.passId)
        )}
        initIncludedLists={lists?.filter((list) =>
          includeListSet.has(list.listId)
        )}
        initIncludedPasses={passes?.filter((pass) =>
          includePassSet.has(pass.passId)
        )}
        initialData={{
          text: text,
          files: ContentFilesFromBare(contents),
          isPaid: !!price,
          price: (price ?? 0).toFixed(0),
          scheduledAt,
          previewIndex
        }}
        save={(batchMessage, contents, passes, lists) => {
          update({
            scheduledEventId,
            batchMessage,
            type,
            contents,
            passes,
            lists
          })
        }}
        schedulable={false}
        setMassMessage={onCancel}
        setVaultContent={() => null}
        vaultContent={[]}
      />
    </Dialog>
  )
}
