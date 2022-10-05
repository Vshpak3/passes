import { Dialog, Menu, Transition } from "@headlessui/react"
import AddToIcon from "public/icons/plus-square.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import { Fragment } from "react"
import { VaultAddToItem, VaultSortItem } from "src/components/atoms"
import { ISortOption } from "src/hooks/vault/useVaultSort"

interface IVaultAddToDropdown {
  onAddToPost: () => void
  onAddToMessage: () => void
}
interface IVaultSortDropdown {
  sortOrder: any
  sortKey: any
  sortKeyOptions: any
  sortByOrderOptions: any
}
interface IVaultDeleteDialog {
  onDeleteVaultItems: any
  toggleDeleteModal: any
}
interface IVaultDeleteModal {
  onDeleteVaultItems: any
  toggleDeleteModal: any
  deleteModalActive: any
  setDeleteModalActive: any
}

const VaultAddToDropdown = ({
  onAddToPost,
  onAddToMessage
}: IVaultAddToDropdown) => {
  return (
    <Menu as="div" className="relative px-2 md:px-3">
      <div className="flex items-center justify-center gap-3">
        <Menu.Button className="cursor-pointer opacity-70 hover:opacity-100">
          <AddToIcon />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-10 z-10 mt-2 box-border flex w-[250px] origin-top-right flex-col items-start justify-start gap-[10px] rounded-md border border-[#2C282D] bg-[#100C11]/50 p-[10px] backdrop-blur-[100px]">
          <Menu.Item>
            <VaultAddToItem onClick={onAddToPost} label="Add to a new post" />
          </Menu.Item>
          <Menu.Item>
            <VaultAddToItem
              onClick={onAddToMessage}
              label="Add to a new message"
            />
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const VaultSortDropdown = ({
  sortOrder,
  sortKey,
  sortKeyOptions,
  sortByOrderOptions
}: IVaultSortDropdown) => {
  return (
    <Menu as="div" className="relative px-3">
      <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
        <Menu.Button>
          <FilterIcon />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-10 z-10 mt-2 box-border flex w-36 origin-top-right flex-col items-start justify-start gap-[10px] rounded-md border border-[#2C282D] bg-[#100C11]/50 p-[10px] backdrop-blur-[100px]">
          {sortKeyOptions.map((item: ISortOption) => (
            <Menu.Item key={item.name}>
              <VaultSortItem
                name={item.name}
                label={item.name}
                // onClick={item.onClick}
                sortedItem={sortKey}
              />
            </Menu.Item>
          ))}
          <hr />
          {sortByOrderOptions.map((item: ISortOption) => (
            <Menu.Item key={item.name}>
              <VaultSortItem
                name={item.name}
                label={item.label}
                onClick={item.onClick}
                sortedItem={sortOrder}
              />
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const VaultDeleteDialog = ({
  onDeleteVaultItems,
  toggleDeleteModal
}: IVaultDeleteDialog) => (
  <>
    <div className="sm:flex sm:items-start">
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          Delete Vault Item
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete the selected vault items?
          </p>
        </div>
      </div>
    </div>
    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        onClick={onDeleteVaultItems}
      >
        Delete
      </button>
      <button
        type="button"
        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
        onClick={toggleDeleteModal}
      >
        Cancel
      </button>
    </div>
  </>
)

const VaultDeleteModal = ({
  onDeleteVaultItems,
  toggleDeleteModal,
  deleteModalActive,
  setDeleteModalActive
}: IVaultDeleteModal) => (
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
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <VaultDeleteDialog
                onDeleteVaultItems={onDeleteVaultItems}
                toggleDeleteModal={toggleDeleteModal}
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
)

export { VaultAddToDropdown, VaultDeleteModal, VaultSortDropdown }
