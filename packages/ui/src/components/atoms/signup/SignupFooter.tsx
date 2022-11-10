import { useSafeRouter } from "src/hooks/useSafeRouter"

interface SignupFooterProps {
  disabled: boolean
}

export const SignupFooter = ({ disabled }: SignupFooterProps) => {
  const { safePush } = useSafeRouter()

  return (
    <button
      className="mt-4 flex text-center text-base text-gray-400"
      disabled={disabled}
      onClick={() => (!disabled ? safePush("/logout") : null)}
    >
      Cancel
    </button>
  )
}
