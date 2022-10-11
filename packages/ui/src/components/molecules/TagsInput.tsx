import classNames from "classnames"
import PlusSignIcon from "public/icons/plus-sign.svg"
import React, { useRef, useState } from "react"
import {
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister
} from "src/components/types/FormTypes"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const dummyRecentTags = ["Jett", "Yoru"]
const dummyAllTags = ["Jett", "Yoru", "Cipher", "Reyna", "Sova", "Viper"]

type InputProps = {
  label?: FormLabel
  name: FormName
  register: FormRegister
  placeholder?: FormPlaceholder
  options?: FormOptions
  tagsFromServer?: string[]
  className?: string
}

export function TagsInput({
  name,
  label,
  placeholder,
  register,
  options = {},
  className = "",
  tagsFromServer = [],
  ...rest
}: InputProps) {
  const [tags, setTags] = useState([...tagsFromServer])
  const [popoverVisibility, setPopoverVisibility] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") {
      return
    }
    const value = e.currentTarget.value
    if (!value.toString()) {
      return
    }
    setTags([...tags, value])
  }

  function removeTag(index: number) {
    setTags(tags.filter((el, i) => i !== index))
  }
  useOnClickOutside(popoverRef, () => setPopoverVisibility(false))

  const displayTags = (tagList: string[]) => {
    return tagList.map((agent) => (
      <div
        key={agent}
        className="border-l-2 border-l-transparent py-2 pl-2 text-[#ffff] hover:border-l-2 hover:border-l-sky-500 hover:bg-[#FFFFFF]/10"
      >
        <span>{agent}</span>
      </div>
    ))
  }

  return (
    <div className="flex flex-wrap items-center rounded border border-passes-dark-200 bg-[#100C11] p-2">
      {tags.map((tag, index) => (
        <div
          className="m-1 inline-block rounded-full bg-[#767676] p-2 text-[#ffff] "
          key={index}
        >
          <span className="text">{tag}</span>
          <span
            className="ml-2 inline-flex cursor-pointer items-center justify-center rounded"
            onClick={() => removeTag(index)}
          >
            &times;
          </span>
        </div>
      ))}
      <div
        onClick={() => setPopoverVisibility(!popoverVisibility)}
        className="ml-auto"
      >
        <PlusSignIcon />
      </div>
      <div
        id="popover-wrapper"
        className="relative z-10 inline-block"
        ref={popoverRef}
      >
        <div
          id="popover-content"
          className={`${
            popoverVisibility ? "visible" : "invisible"
          } absolute left-[-280px] w-auto bg-passes-dark-100 pb-6 pl-6 pr-6 before:right-[calc(50%_-_10px)] ${
            popoverVisibility ? "opacity-100" : "opacity-0"
          } max-h-[300px] overflow-y-auto rounded transition-all duration-1000 ease-in-out before:absolute before:content-[""]`}
        >
          <div
            id="popover-header"
            className="sticky top-0 overflow-hidden bg-passes-dark-100 pt-6"
          >
            <input
              readOnly={options.readOnly}
              autoComplete="off"
              onKeyDown={handleKeyDown}
              type={"text"}
              {...register(name, options)}
              {...rest}
              // className="tags-input"
              className={classNames(
                "mb-6 w-full grow rounded border-none border-red-500 bg-[#504F57] text-[#ffff] outline-none",
                className
              )}
              placeholder={placeholder || label || "Add more tags!"}
            />
          </div>
          <p className="mb-2 text-[#ffff]/60">Recent Tags</p>
          {displayTags(dummyRecentTags)}
          <p className="mt-4 mb-2 text-[#ffff]/60">All Tags</p>
          {displayTags(dummyAllTags)}
        </div>
      </div>
    </div>
  )
}
