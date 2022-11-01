import { Combobox } from "@headlessui/react"
import { FC } from "react"

import { formatText } from "src/helpers/formatters"

interface CustomResultProps {
  text: string
}

export const CustomResult: FC<CustomResultProps> = ({ text }) => (
  <Combobox.Option value="placeholder" disabled>
    <div className="my-4 pl-6 text-[#ffffff]/30">
      <p>{formatText(text)}</p>
    </div>
  </Combobox.Option>
)
