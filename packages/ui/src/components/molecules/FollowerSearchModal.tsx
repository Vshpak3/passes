import { Combobox } from "@headlessui/react"
import classNames from "classnames"
import { Dispatch, SetStateAction } from "react"
import { Modal } from "src/components/organisms"
import { useFollowerSearch } from "src/hooks"

interface IFollowSearchModal {
  onSelect: (userId: string) => Promise<void>
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<any>>
  fromList: boolean
}

const FollowSearchModal = ({
  onSelect,
  isOpen,
  setOpen,
  fromList = false
}: IFollowSearchModal) => {
  const { following, onChangeInput } = useFollowerSearch()

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Combobox as="div">
        <h2 className="mb-5 font-semibold text-white">Search Followers</h2>
        {fromList && (
          <p>Note: Followers may already be in your list and show up here</p>
        )}
        <Combobox.Input
          placeholder="Search people.."
          className="box-border flex w-full items-start justify-between gap-[10px] rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px] text-sm outline-0  ring-0 focus:border-passes-dark-200  focus:outline-none focus:ring-0"
          onChange={onChangeInput}
        />

        {following.length > 0 && (
          <Combobox.Options
            className="absolute top-14 z-10 mt-1 box-border  flex max-h-60 w-full flex-col items-start justify-start gap-[10px] overflow-auto
         rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
          "
          >
            {following.map((user) => (
              <Combobox.Option
                key={user.userId}
                value={user}
                className={({ active }) =>
                  classNames(
                    "relative  w-full cursor-pointer select-none py-2 pl-3 pr-9",
                    active ? " bg-gray-100/10" : "text-white"
                  )
                }
                onClick={() => onSelect(user.userId)}
              >
                <>
                  <div className="flex items-center">
                    <span className="ml-2 truncate">
                      @{user.username} {user.displayName ?? ""}
                    </span>
                  </div>
                </>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </Combobox>
    </Modal>
  )
}
export default FollowSearchModal
