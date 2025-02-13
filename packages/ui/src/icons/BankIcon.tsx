import { FC, SVGProps } from "react"

interface BankIconProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
}

// Adapted from: https://icons.modulz.app
export const BankIcon: FC<BankIconProps> = ({
  width = 15,
  height = 15,
  ...restOfProps
}) => (
  <svg
    fill="none"
    height={height}
    viewBox="0 0 25 24"
    width={width}
    xmlns="http://www.w3.org/2000/svg"
    {...restOfProps}
  >
    <path
      d="M19.5 9V17M5.5 9V17V9ZM10 9V17V9ZM15 9V17V9Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M19.9 21C20.4601 21 20.7401 21 20.954 20.891C21.1422 20.7952 21.2951 20.6422 21.391 20.454C21.5 20.2401 21.5 19.9601 21.5 19.4V18.6C21.5 18.04 21.5 17.7599 21.391 17.546C21.2951 17.3579 21.1422 17.2049 20.954 17.109C20.7401 17 20.4601 17 19.9 17H5.1C4.53995 17 4.25992 17 4.04601 17.109C3.85785 17.2049 3.70487 17.3579 3.60899 17.546C3.5 17.7599 3.5 18.04 3.5 18.6V19.4C3.5 19.9601 3.5 20.2401 3.60899 20.454C3.70487 20.6422 3.85785 20.7952 4.04601 20.891C4.25992 21 4.53995 21 5.1 21H19.9Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M19.9 8.99904C20.4601 8.99904 20.7401 8.99904 20.954 8.89005C21.1422 8.79417 21.2951 8.64119 21.391 8.45303C21.5 8.23912 21.5 7.95909 21.5 7.39904V6.28252C21.5 5.82455 21.5 5.59557 21.4188 5.40661C21.3473 5.23994 21.2317 5.09587 21.0845 4.98984C20.9177 4.86964 20.6942 4.81996 20.2471 4.72062L12.8471 3.07617C12.7176 3.04739 12.6528 3.033 12.5874 3.02726C12.5292 3.02216 12.4708 3.02216 12.4126 3.02726C12.3472 3.033 12.2824 3.04739 12.1529 3.07617L4.75291 4.72062C4.30585 4.81996 4.08232 4.86964 3.91546 4.98984C3.76829 5.09587 3.65273 5.23994 3.58115 5.40661C3.5 5.59556 3.5 5.82455 3.5 6.28251V7.39904C3.5 7.95909 3.5 8.23912 3.60899 8.45303C3.70487 8.64119 3.85785 8.79417 4.04601 8.89005C4.25992 8.99904 4.53995 8.99904 5.1 8.99904H19.9Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
)
