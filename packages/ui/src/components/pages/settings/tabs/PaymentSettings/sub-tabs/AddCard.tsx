import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { FC, memo } from "react"

import { NewCard } from "src/components/molecules/payment/NewCard"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"

interface AddCardProps {
  callback?: () => void
}

const AddCard: FC<AddCardProps> = ({ callback }) => {
  const { addOrPopStackHandler } = useSettings() as SettingsContextProps

  return (
    <>
      <Tab defaultSubTab={SubTabsEnum.PaymentSettings} title="Add Card" />
      <NewCard
        callback={
          callback ?? (() => addOrPopStackHandler(SubTabsEnum.PaymentSettings))
        }
      />
    </>
  )
}

export default memo(AddCard) // eslint-disable-line import/no-default-export
