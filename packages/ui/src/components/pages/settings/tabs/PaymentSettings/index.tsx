import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayinMethodDto } from "@passes/api-client"
import { FC, memo, useState } from "react"

import { Button } from "src/components/atoms/Button"
import { Modal } from "src/components/organisms/Modal"
import { PaymentSettingsCreditCard } from "src/components/organisms/payment-settings/PaymentSettingsCreditCard"
import { PaymentSettingsCrypto } from "src/components/organisms/payment-settings/PaymentSettingsCrypto"
import { PaymentSettingsDefault } from "src/components/organisms/payment-settings/PaymentSettingsDefault"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { usePayinMethod } from "src/hooks/usePayinMethod"
import AddCard from "./sub-tabs/AddCard"

interface PaymentSettingsProps {
  addCardHandler?: null | (() => void)
  isEmbedded?: boolean
  onSetDefaultPayment?: (value: PayinMethodDto) => void
}

const PaymentSettings: FC<PaymentSettingsProps> = ({
  isEmbedded = false,
  onSetDefaultPayment
}) => {
  const { addOrPopStackHandler } = useSettings() as SettingsContextProps

  const { setDefaultPayinMethod, getCards } = usePayinMethod()

  const handleSetDefaultPayInMethod = async (value: PayinMethodDto) => {
    await setDefaultPayinMethod(value)

    if (onSetDefaultPayment) {
      onSetDefaultPayment(value)
    }
  }

  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      {isEmbedded && (
        <Modal isOpen={open} setOpen={setOpen}>
          <AddCard
            callback={() => {
              setOpen(false)
              getCards()
            }}
          />
        </Modal>
      )}
      {!isEmbedded && (
        <Tab
          withBackMobile
          title="Payment Settings"
          description="Add and manage payment methods."
        />
      )}
      {!isEmbedded && (
        <Button
          variant="pink"
          tag="button"
          className="mt-5"
          onClick={() => addOrPopStackHandler(SubTabsEnum.PaymentHistory)}
        >
          View Payment History
        </Button>
      )}
      <PaymentSettingsDefault isEmbedded={isEmbedded} />
      <PaymentSettingsCrypto
        isEmbedded={isEmbedded}
        handleSetDefaultPayInMethod={handleSetDefaultPayInMethod}
      />
      <PaymentSettingsCreditCard
        isEmbedded={isEmbedded}
        setOpen={setOpen}
        addOrPopStackHandler={addOrPopStackHandler}
        handleSetDefaultPayInMethod={handleSetDefaultPayInMethod}
      />
    </>
  )
}

export default memo(PaymentSettings) // eslint-disable-line import/no-default-export
