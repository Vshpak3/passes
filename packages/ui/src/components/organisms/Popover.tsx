import * as RadixPopover from "@radix-ui/react-popover"
import classNames from "classnames"
import { FC } from "react"
import { Text } from "src/components/atoms/Text"
import { formatText } from "src/helpers/formatters"
import { Cross } from "src/icons/cross"

export interface PopoverProps {
  avoidCollisions: any
  children: any
  description: string
  title: string
  trigger: any
  triggerClassName: any
  popoverClassName: any
}

export const Popover: FC<PopoverProps> = ({
  avoidCollisions = true,
  children,
  description,
  title,
  trigger,
  triggerClassName = "",
  popoverClassName = ""
}) => (
  <RadixPopover.Root>
    <RadixPopover.Trigger className={triggerClassName}>
      {trigger}
    </RadixPopover.Trigger>
    <RadixPopover.Content
      // className=
      className={classNames(
        "relative max-w-full overflow-y-auto rounded-t-xl border-0 border-t p-4 pb-12 dark:border-mauveDark-mauve7 dark:bg-black lg:w-80 lg:rounded-xl lg:border lg:pb-4",
        popoverClassName
      )}
      avoidCollisions={avoidCollisions}
    >
      {title && (
        <div className="flex max-w-full justify-between space-x-6">
          <div className="min-w-0 break-words">
            <Text fontSize={18} className="font-bold">
              {formatText(title)}
            </Text>
          </div>
          <div className="h-4 w-4" />
        </div>
      )}
      {description && (
        <div className="my-4">
          <Text className="text-mauve-mauve11 dark:text-mauveDark-mauve11">
            {formatText(description)}
          </Text>
        </div>
      )}
      {children}
      <RadixPopover.Close className="pushable click-target-helper absolute top-4 right-5 flex min-w-fit rounded-full text-mauve-mauve11 hover:text-mauve-mauve12 focus:outline-none focus-visible:ring-2 focus-visible:ring-mauve-mauve7 focus-visible:ring-offset-4 focus-visible:ring-offset-mauve-mauve1 active:text-mauve-mauve12 dark:text-mauveDark-mauve11 dark:hover:text-mauveDark-mauve12 dark:focus-visible:ring-mauveDark-mauve7 dark:focus-visible:ring-offset-mauveDark-mauve1 dark:active:text-mauveDark-mauve12">
        <Cross width={16} height={16} />
      </RadixPopover.Close>
    </RadixPopover.Content>
  </RadixPopover.Root>
)
