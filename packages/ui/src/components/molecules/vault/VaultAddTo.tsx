import { Menu, Transition } from "@headlessui/react"
import AddToIcon from "public/icons/plus-square.svg"
import { FC, Fragment } from "react"
import { VaultAddToItem } from "src/components/atoms/vault"

interface VaultAddToDropdownProps {
  onAddToPost: () => void
  onAddToMessage: () => void
}

export const VaultAddToDropdown: FC<VaultAddToDropdownProps> = ({
  onAddToPost,
  onAddToMessage
}) => {
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
