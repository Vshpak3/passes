import { useRouter } from "next/router"
import ArrowRightIcon from "public/icons/arrow-right.svg"
import { FC, FormEventHandler, PropsWithChildren } from "react"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Text } from "src/components/atoms/Text"
import { formatText } from "src/helpers/formatters"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

interface AdminTabProps {
  title: string
  onSubmit: FormEventHandler<HTMLFormElement>
  disableButton: boolean
  label: string
}

export const AdminTab: FC<PropsWithChildren<AdminTabProps>> = ({
  title,
  onSubmit,
  children,
  disableButton,
  label = "Submit"
}) => {
  const router = useRouter()
  const handleBack = () => {
    router.push("/admin")
  }
  const { isTablet } = useWindowSize()
  return (
    <div className="flex w-full flex-col">
      <div className="border-b border-passes-dark-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isTablet && (
              <button className="mr-4" onClick={handleBack}>
                <ArrowRightIcon />
              </button>
            )}
            <h3 className="text-label-lg passes-break whitespace-pre-wrap">
              {formatText(title)}
            </h3>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center overflow-x-auto">
        <form
          className="flex w-full flex-col gap-y-5 p-8 md:w-[600px]"
          onSubmit={onSubmit}
        >
          {children}
          <Button disabled={disableButton} type={ButtonTypeEnum.SUBMIT}>
            <Text className="font-medium" fontSize={16}>
              {label}
            </Text>
          </Button>
        </form>
      </div>
    </div>
  )
}
