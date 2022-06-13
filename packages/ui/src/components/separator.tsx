import * as RadixSeparator from '@radix-ui/react-separator'
import clsx from 'clsx'
import styles from 'src/styles/modules/separator.module.css'

export const Separator = ({
  className,
  orientation = 'horizontal',
}: {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}) => (
  <RadixSeparator.Root
    className={clsx(
      'self-stretch',
      styles.separator,
      orientation === 'horizontal'
        ? ' bg-mauve-mauve5 dark:bg-mauveDark-mauve5'
        : ' bg-mauve-mauve7 dark:bg-mauveDark-mauve7',
      className,
    )}
    orientation={orientation}
  />
)
