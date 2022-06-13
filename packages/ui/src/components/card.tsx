import clsx from 'clsx'
import type { ReactNode } from 'react'

export const Card = ({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) => <div className={clsx('rounded-xl', className)}>{children}</div>
