import * as RadixDialog from "@radix-ui/react-dialog"
import PropTypes from "prop-types"
import Cross from "src/icons/cross"

import { Text } from "../atoms"

const Dialog = ({
  children,
  description,
  title,
  trigger,
  triggerClassName = ""
}) => (
  <RadixDialog.Root>
    <RadixDialog.Trigger className={triggerClassName}>
      {trigger}
    </RadixDialog.Trigger>
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 grid place-items-end overflow-y-auto bg-black/50 backdrop-blur transition dark:bg-black/80 sm:place-items-center">
        <RadixDialog.Content className="relative max-h-[90%] min-h-min w-full max-w-full overflow-y-auto rounded-t-2xl bg-mauve-mauve1 p-7 pb-14 dark:bg-mauveDark-mauve1 sm:max-w-lg sm:rounded-xl sm:pb-7">
          <div className="flex max-w-full justify-between space-x-6">
            <RadixDialog.Title className="min-w-0 break-words">
              <Text fontSize={18} className="font-bold">
                {title}
              </Text>
            </RadixDialog.Title>
            <div className="h-4 w-4" />
          </div>
          <RadixDialog.Description className="mt-2 mb-4">
            <Text className="text-mauve-mauve11 dark:text-mauveDark-mauve11">
              {description}
            </Text>
          </RadixDialog.Description>
          {children}
          <RadixDialog.Close className="pushable click-target-helper absolute top-4 right-5 flex min-w-fit rounded-full text-mauve-mauve11 hover:text-mauve-mauve12 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve-mauve7 focus-visible:ring-offset-4 focus-visible:ring-offset-mauve-mauve1 active:text-mauve-mauve12 dark:text-mauveDark-mauve11 dark:hover:text-mauveDark-mauve12 dark:focus-visible:ring-mauveDark-mauve7 dark:focus-visible:ring-offset-mauveDark-mauve1 dark:active:text-mauveDark-mauve12">
            <Cross width={18} height={18} />
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Overlay>
    </RadixDialog.Portal>
  </RadixDialog.Root>
)

Dialog.propTypes = {
  children: PropTypes.node,
  description: PropTypes.node,
  title: PropTypes.node,
  trigger: PropTypes.node,
  triggerClassName: PropTypes.string
}

export default Dialog
