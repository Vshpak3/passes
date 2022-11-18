import SquarePlusIcon from "public/icons/square-plus-icon.svg"
import { FC, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

import { NewPostCategoryDialog } from "src/components/molecules/post/NewPostCategoryDialog"
import { PostCategoryCached } from "src/components/pages/tools/PostCategoryCached"
import { usePostCategories } from "src/hooks/posts/usePostCategories"
import { useUser } from "src/hooks/useUser"
import { usePostWebhook } from "src/hooks/webhooks/usePostWebhook"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const PostCategories: FC = () => {
  usePostWebhook()
  const [createCategory, setCreateCategory] = useState<boolean>(false)
  const { user } = useUser()
  const { postCategories, deleteCategory, reorder } = usePostCategories(
    user?.userId
  )
  return (
    <div className="mt-16 grid w-full grid-cols-7 lg:mt-0">
      {createCategory && (
        <NewPostCategoryDialog
          isOpen
          onCancel={() => setCreateCategory(false)}
        />
      )}
      <div className="col-span-7 border-r-[1px] border-passes-gray lg:col-span-4">
        <div className="flex flex-row justify-between border-b-[1px] border-passes-gray p-4">
          <SquarePlusIcon onClick={() => setCreateCategory(true)} />
        </div>
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            // // dropped outside the list
            if (!destination || destination.index === source.index) {
              return
            }
            const cp = [...(postCategories ?? [])]
            const moved = cp.splice(source.index, 1)
            cp.splice(destination.index, 0, ...moved)
            reorder([...(postCategories ?? [])], cp)
          }}
        >
          <Droppable
            direction="vertical"
            droppableId="id"
            isCombineEnabled={false}
            isDropDisabled={false}
            type="CARD"
          >
            {(dropProvided) => (
              <div {...dropProvided.droppableProps}>
                <div ref={dropProvided.innerRef}>
                  {postCategories?.map((postCategory, index) => (
                    <Draggable
                      draggableId={postCategory.postCategoryId}
                      index={index}
                      isDragDisabled={false}
                      key={postCategory.postCategoryId}
                    >
                      {(dragProvided) => (
                        <div
                          {...dragProvided.dragHandleProps}
                          {...dragProvided.draggableProps}
                          ref={dragProvided.innerRef}
                        >
                          <PostCategoryCached
                            onDelete={deleteCategory}
                            postCategory={postCategory}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="min-safe-h-screen sticky col-span-3 hidden max-w-[500px] flex-col lg:flex lg:px-2 lg:pr-8 xl:pl-8" />
    </div>
  )
}

export default WithNormalPageLayout(PostCategories, {
  creatorOnly: true,
  headerTitle: "Post Categories"
})
