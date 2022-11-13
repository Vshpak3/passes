import React, { memo, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { ConfirmationDialog } from "src/components/organisms/ConfirmationDialog"
import { Tab } from "src/components/pages/settings/Tab"

const DeactivateAccount = () => {
  const [showDeactivateConfirmationModal, setShowDeactivateConfirmationModal] =
    useState(false)

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const deactivateAccountHandler = () => {}

  const hideDeactivateModalHandler = () =>
    setShowDeactivateConfirmationModal(false)

  return (
    <>
      <Tab
        description="Find out how you can deactivate your account."
        title="Deactivate Your Account"
      />
      <Button
        className="mt-6 w-auto !px-[68px]"
        onClick={() => setShowDeactivateConfirmationModal(true)}
      >
        <span>Deactivate Account</span>
      </Button>
      <ConfirmationDialog
        confirmString="Deactivate"
        desc="This process can not be undone."
        isOpen={showDeactivateConfirmationModal}
        onClose={hideDeactivateModalHandler}
        onConfirm={deactivateAccountHandler}
        title="Are You Sure?"
      />
    </>
  )
}

export default memo(DeactivateAccount) // eslint-disable-line import/no-default-export
