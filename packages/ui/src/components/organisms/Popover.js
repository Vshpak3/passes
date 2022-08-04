import * as RadixPopover from "@radix-ui/react-popover"
import PropTypes from "prop-types"
import Cross from "src/icons/cross"

import { Text } from "../atoms"

const Popover = ({
  avoidCollisions = true,
  children,
  description,
  title,
  trigger,
  triggerClassName = ""
}) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger className={triggerClassName}>
      {trigger}
    </RadixPopover.Trigger>
    <RadixPopover.Content
      className="relative mt-2 max-w-full overflow-y-auto rounded-t-xl border-0 border-t border-mauve-mauve7 bg-mauve-mauve1 p-4 pb-12 dark:border-mauveDark-mauve7 dark:bg-black lg:w-80 lg:rounded-xl lg:border lg:pb-4"
      avoidCollisions={avoidCollisions}
    >
      <div className="flex max-w-full justify-between space-x-6">
        <div className="min-w-0 break-words">
          <Text fontSize={18} className="font-bold">
            {title}
          </Text>
        </div>
        <div className="h-4 w-4" />
      </div>
      <div className="my-2">
        <Text className="text-mauve-mauve11 dark:text-mauveDark-mauve11">
          {description}
        </Text>
      </div>
      {children}
      <RadixPopover.Close className="pushable click-target-helper absolute top-4 right-5 flex min-w-fit rounded-full text-mauve-mauve11 hover:text-mauve-mauve12 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve-mauve7 focus-visible:ring-offset-4 focus-visible:ring-offset-mauve-mauve1 active:text-mauve-mauve12 dark:text-mauveDark-mauve11 dark:hover:text-mauveDark-mauve12 dark:focus-visible:ring-mauveDark-mauve7 dark:focus-visible:ring-offset-mauveDark-mauve1 dark:active:text-mauveDark-mauve12">
        <Cross width={16} height={16} />
      </RadixPopover.Close>
    </RadixPopover.Content>
  </RadixPopover.Root>
)

Popover.propTypes = {
  avoidCollisions: PropTypes.bool,
  children: PropTypes.node,
  description: PropTypes.node,
  title: PropTypes.node,
  trigger: PropTypes.node,
  triggerClassName: PropTypes.string
}

export default Popover
