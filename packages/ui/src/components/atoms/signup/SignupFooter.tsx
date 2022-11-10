import { useSafeRouter } from "src/hooks/useSafeRouter"

interface SignupFooterProps {
  cancellable: boolean
}

export const SignupFooter = ({ cancellable }: SignupFooterProps) => {
  const { safePush } = useSafeRouter()

  return (
    <button
      className="mt-4 flex text-center text-base text-gray-400"
      onClick={() => (cancellable ? safePush("/logout") : null)}
    >
      Cancel
    </button>
  )
}
