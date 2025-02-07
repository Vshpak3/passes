import { Combobox } from "@headlessui/react"
import { FC } from "react"

import { formatText } from "src/helpers/formatters"

interface CustomResultProps {
  text: string
}

export const CustomResult: FC<CustomResultProps> = ({ text }) => (
  <Combobox.Option disabled value="placeholder">
    <div className="my-6 pl-6 text-passes-dark-gray">
      <p className="passes-break whitespace-pre-wrap">{formatText(text)}</p>
    </div>
  </Combobox.Option>
)
