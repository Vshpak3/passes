import { AdminApi, ChargebackDto } from "@passes/api-client"
import { useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/button/Button"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { errorMessage } from "src/helpers/error"

interface ChargebackProps {
  chargeback: ChargebackDto
  secret: string
}

const api = new AdminApi()

export const Chargeback = ({ chargeback, secret }: ChargebackProps) => {
  const [removed, setRemoved] = useState<boolean>(false)
  const [disputedModalOpen, setDisputedModalOpen] = useState(false)
  const [undisputedModalOpen, setUndisputedModalOpen] = useState(false)

  const onDisputed = async () => {
    try {
      await api.updateChargeback({
        updateChargebackRequestDto: {
          circleChargebackId: chargeback.chargebackId,
          disputed: true,
          secret
        }
      })
      toast.success("Chargeback marked as disputed")
      setRemoved(true)
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  const onUndisputed = async () => {
    try {
      await api.updateChargeback({
        updateChargebackRequestDto: {
          circleChargebackId: chargeback.chargebackId,
          disputed: false,
          secret
        }
      })
      toast.success("Chargeback marked as undisputed")
      setRemoved(true)
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }
  return (
    <div
      className={
        removed
          ? "hidden"
          : "passes-break flex flex-row items-center justify-between whitespace-pre-wrap border border-passes-gray-200"
      }
      key={chargeback.userId}
    >
      <div>{JSON.stringify(chargeback, null, 4)}</div>
      <div className="flex flex-row items-center justify-between">
        <Button onClick={() => setUndisputedModalOpen(true)}>Undisputed</Button>
        <Button onClick={() => setDisputedModalOpen(true)}>Disputed </Button>
      </div>
      {disputedModalOpen && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setDisputedModalOpen(false)}
          onDelete={onDisputed}
          text="Mark Disputed"
        />
      )}
      {undisputedModalOpen && (
        <DeleteConfirmationModal
          isOpen
          onClose={() => setUndisputedModalOpen(false)}
          onDelete={onUndisputed}
          text="Mark Undisputed"
        />
      )}
    </div>
  )
}
