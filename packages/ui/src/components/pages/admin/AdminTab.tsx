import ArrowRightIcon from "public/icons/arrow-right.svg"
import { FC, FormEventHandler, PropsWithChildren } from "react"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Text } from "src/components/atoms/Text"
import { formatText } from "src/helpers/formatters"

interface TabProps {
  title: string
  onSubmit: FormEventHandler<HTMLFormElement>
  isSubmitting: boolean
  label: string
}

export const Tab: FC<PropsWithChildren<TabProps>> = ({
  title,
  onSubmit,
  children,
  isSubmitting,
  label = "Submit"
}) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-passes-dark-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-4">
              <ArrowRightIcon />
            </button>
            <h3 className="text-label-lg passes-break whitespace-pre-wrap">
              {formatText(title)}
            </h3>
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-156px)] w-full overflow-x-scroll">
        <form className="flex flex-col gap-y-5 p-8" onSubmit={onSubmit}>
          {children}
          <Button disabled={isSubmitting} type={ButtonTypeEnum.SUBMIT}>
            <Text className="font-medium" fontSize={16}>
              {label}
            </Text>
          </Button>
        </form>
      </div>
    </div>
  )
}
