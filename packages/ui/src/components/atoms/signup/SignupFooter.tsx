import { useSafeRouter } from "src/hooks/useSafeRouter"

export const SignupFooter = () => {
  const { safePush } = useSafeRouter()

  return (
    <button
      className="mt-4 flex text-center text-base text-gray-400"
      onClick={() => safePush("/logout")}
    >
      Cancel
    </button>
  )
}
