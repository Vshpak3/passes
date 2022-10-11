import React, { useState } from "react"
import { Button } from "src/components/atoms/Button"
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
        withBack
        title="Deactivate Your Account"
        description="Find out how you can deactivate your account."
      />
      <Button
        variant="pink"
        className="mt-6 w-auto !px-[68px]"
        tag="button"
        onClick={() => setShowDeactivateConfirmationModal(true)}
      >
        <span>Deactivate Account</span>
      </Button>
      <ConfirmationDialog
        isOpen={showDeactivateConfirmationModal}
        onClose={hideDeactivateModalHandler}
        onConfirm={deactivateAccountHandler}
        title="Are You Sure?"
        desc="This process can not be undone."
        confirmString="Deactivate"
      />
    </>
  )
}

export default DeactivateAccount // eslint-disable-line import/no-default-export
