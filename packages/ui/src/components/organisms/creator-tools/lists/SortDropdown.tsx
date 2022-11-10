import { RadioGroup } from "@headlessui/react"
import { Fade, Popper } from "@mui/material"
import CheckIcon from "public/icons/check.svg"
import FilterIcon from "public/icons/three-lines-icon.svg"
import { useCallback, useRef, useState } from "react"

import { useOnClickOutside } from "src/hooks/useOnClickOutside"

export const orderTypeDisplayNames: Record<string, string> = {
  name: "Name",
  username: "Username",
  "updated at": "Updated At",
  "created at": "Added at date",
  recent: "Most recent",
  oldest: "Oldest",
  tip: "Highest tip amount",
  purchased: "Purchased",
  notPurchased: "Not purchased"
}

const sortPopperId = "sort-popper"

export interface SortOption<OrderType, Order = "desc"> {
  orderType: OrderType
  order?: Order
}

interface SortListPopupProps<OrderType, Order> {
  selection: SortOption<OrderType, Order>
  options: SortOption<OrderType, Order>[]
  onSelect: (option: SortOption<OrderType, Order>) => void
  isCheckbox?: boolean
  dropdownTitle?: string
}

export const SortDropdown = <OrderType extends string, Order = "desc">({
  selection,
  options,
  onSelect,
  isCheckbox = true,
  dropdownTitle = "Sort by"
}: SortListPopupProps<OrderType, Order>) => {
  const [isPopperOpen, setIsPopperOpen] = useState(false)
  const ref = useRef(null)
  const radioGroupRef = useRef(null)
  useOnClickOutside(radioGroupRef, () => setIsPopperOpen(false))

  const handleOpenPopper = useCallback(
    () => setIsPopperOpen((state) => !state),
    []
  )

  const onChange = useCallback(
    (option: SortOption<OrderType, Order>) => {
      onSelect(option)
      setIsPopperOpen(false)
    },
    [onSelect]
  )

  return (
    <>
      <button
        aria-describedby={sortPopperId}
        aria-label="Sort"
        onClick={handleOpenPopper}
        ref={ref}
        type="button"
      >
        <FilterIcon />
      </button>
      <Popper
        anchorEl={ref.current}
        id={sortPopperId}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8]
            }
          }
        ]}
        open={isPopperOpen}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div ref={radioGroupRef}>
              <RadioGroup
                className="w-[254px] rounded-[15px] border border-[rgba(255,255,255,0.15)] bg-[#12070E] p-[26px] backdrop-blur-[15px]"
                onChange={onChange}
              >
                <RadioGroup.Label className="mb-3 block">
                  {dropdownTitle}
                </RadioGroup.Label>
                <div className="flex w-full flex-col gap-[12px]">
                  {options.map((option) => {
                    const { orderType, order } = option

                    let name = orderTypeDisplayNames[orderType]
                    if (option.order) {
                      name += ` (${order})`
                    }

                    const isSelected =
                      selection.orderType === orderType &&
                      (order ? selection.order === order : true)

                    return (
                      <RadioGroup.Option
                        className="flex w-full cursor-pointer items-center justify-between text-passes-gray-800"
                        key={`${orderType}:${order}`}
                        value={option}
                      >
                        <span
                          className={
                            !isCheckbox && isSelected
                              ? "font-bold text-white"
                              : ""
                          }
                        >
                          {name}
                        </span>
                        {isCheckbox &&
                          (isSelected ? (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-passes-primary-color">
                              <CheckIcon className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="h-4 w-4 rounded-full border border-passes-gray-900 bg-passes-dark-700" />
                          ))}
                      </RadioGroup.Option>
                    )
                  })}
                </div>
              </RadioGroup>
            </div>
          </Fade>
        )}
      </Popper>
    </>
  )
}
