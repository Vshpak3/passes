import { Dialog, Transition } from "@headlessui/react"
import { FC, Fragment } from "react"
import { Cross } from "src/icons/CrossIcon"

interface VaultDeleteDialogProps {
  onDeleteVaultItems: () => void
  toggleDeleteModal: () => void
}

interface VaultDeleteModalProps {
  onDeleteVaultItems: () => void
  toggleDeleteModal: () => void
  deleteModalActive: boolean
  setDeleteModalActive: (active: boolean) => void
}

const VaultDeleteDialog: FC<VaultDeleteDialogProps> = ({
  onDeleteVaultItems,
  toggleDeleteModal
}) => (
  <>
    <div className="sm:flex sm:items-start">
      <div className="relative mt-3 flex w-full flex-col items-center text-center sm:mt-0 sm:ml-4 sm:text-left">
        <div
          className="absolute top-0 right-0 cursor-pointer"
          onClick={toggleDeleteModal}
        >
          <Cross />
        </div>
        <Dialog.Title
          as="h3"
          className="text-[16px] font-bold leading-6 text-white"
        >
          Delete Vault Items
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-[12px] text-gray-500">
            Are you sure you want to delete the selected vault items?
          </p>
        </div>
      </div>
    </div>
    <div className="my-[10px] h-[1px] w-full bg-[#2C282D]" />
    <div className="mt-5 flex flex-row justify-between sm:mt-4">
      <button
        type="button"
        className="rounded-full bg-[#C943A82B] px-4 py-[6px] text-[16px] font-bold text-[#C943A8] focus:outline-none"
        onClick={onDeleteVaultItems}
      >
        Delete
      </button>
      <button
        type="button"
        className="rounded-full bg-[#9C9C9C2B] px-4 py-[6px] text-[16px] font-bold text-[#EDECED] focus:outline-none"
        onClick={toggleDeleteModal}
      >
        Cancel
      </button>
    </div>
  </>
)

export const VaultDeleteModal: FC<VaultDeleteModalProps> = ({
  onDeleteVaultItems,
  toggleDeleteModal,
  deleteModalActive,
  setDeleteModalActive
}) => (
  <Transition.Root show={deleteModalActive} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={setDeleteModalActive}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#100C11] px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:p-6">
              <VaultDeleteDialog
                onDeleteVaultItems={() => {
                  onDeleteVaultItems()
                  setDeleteModalActive(false)
                }}
                toggleDeleteModal={toggleDeleteModal}
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
)
