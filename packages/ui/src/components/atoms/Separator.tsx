import * as RadixSeparator from "@radix-ui/react-separator"
import styles from "src/styles/modules/separator.module.css"

export interface SeparatorProps {
  className?: string
  orientation?: "horizontal" | "vertical"
}

const Separator = ({
  className = "",
  orientation = "horizontal"
}: SeparatorProps) => (
  <RadixSeparator.Root
    className={
      "self-stretch" +
      ` ${styles.separator}` +
      (orientation === "horizontal"
        ? " bg-mauve-mauve5 dark:bg-mauveDark-mauve5"
        : " bg-mauve-mauve7 dark:bg-mauveDark-mauve7") +
      (className && ` ${className}`)
    }
    orientation={orientation}
  />
)

export default Separator
