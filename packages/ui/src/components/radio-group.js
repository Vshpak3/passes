import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import PropTypes from "prop-types"

const RadioGroup = ({ id, value }) => (
  <RadixRadioGroup.Root id={id} value={value}>
    <RadixRadioGroup.Item>
      <RadixRadioGroup.Indicator />
    </RadixRadioGroup.Item>
  </RadixRadioGroup.Root>
)

RadioGroup.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string
}

export default RadioGroup
