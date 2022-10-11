import classNames from "classnames"
import FilterLines from "public/icons/filter-lines.svg"
import React, { FC, useRef, useState } from "react"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

import { Filters } from "./types"

const filters = [
  { name: "Most Recent", id: Filters["most-recent"] },
  { name: "Most Earned", id: Filters["most-earned"] },
  { name: "Most Reached", id: Filters["most-reached"] },
  { name: "Most Purchased", id: Filters["most-purchased"] },
  { name: "Highest Price", id: Filters["highest-price"] }
]

interface IFilterProps {
  activeFilter: Filters
  setActiveFilter: (filter: Filters) => void
}

export const Filter: FC<IFilterProps> = ({ activeFilter, setActiveFilter }) => {
  const [showFilterDropDown, setShowFilterDropDown] = useState(false)

  const filterEl = useRef(null)
  useOnClickOutside(filterEl, () => {
    setShowFilterDropDown(false)
  })

  const activeFilterHandler = (filter: Filters) => {
    setActiveFilter(filter)
    setShowFilterDropDown(false)
  }

  return (
    <div className="relative mt-5 inline-block lg:mt-6" ref={filterEl}>
      <button
        className="flex items-center space-x-[5px]"
        onClick={() => setShowFilterDropDown((show) => !show)}
      >
        <FilterLines />
        <span className="text-base font-medium">
          {filters.find(({ id }) => id === activeFilter)?.name}
        </span>
      </button>

      {showFilterDropDown && (
        <ul className="text-label absolute left-[17px] translate-y-3 whitespace-nowrap rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3">
          {filters
            .filter(({ id }) => id !== activeFilter)
            .map(({ id, name }, i) => (
              <li
                key={id}
                className={classNames(
                  // first element
                  i === 0
                    ? "border-b border-passes-dark-200 pb-2.5"
                    : // last element
                    i === filters.length - 2
                    ? "pt-2.5"
                    : "border-b border-passes-dark-200 py-2.5"
                )}
              >
                <button onClick={() => activeFilterHandler(id)}>{name}</button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
