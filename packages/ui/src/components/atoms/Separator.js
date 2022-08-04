import * as RadixSeparator from "@radix-ui/react-separator"
import PropTypes from "prop-types"
import styles from "src/styles/modules/separator.module.css"

const Separator = ({ className = "", orientation = "horizontal" }) => (
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

Separator.propTypes = {
  className: PropTypes.string,
  orientation: PropTypes.string
}

export default Separator
