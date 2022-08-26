import { WalletApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { useLocalStorage, useUser } from "src/hooks"

const NewAddress = () => {
  const [submitting, setSubmitting] = useState(false)

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {}
  })

  const [accessToken] = useLocalStorage("access-token", "")
  const { user, loading } = useUser()
  const router = useRouter()

  const onSubmit = async () => {
    setSubmitting(true)
    try {
      const values: any = getValues()

      const walletApi = new WalletApi()
      //TODO: handle error on frontend (display some generic message)
      await walletApi.walletCreateUnauthenticated(
        {
          createUnauthenticatedWalletRequestDto: {
            walletAddress: values["address"],
            chain: values["chain"]
          }
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        }
      )
      router.push("/payment/default-payout-method")
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])
  //TODO: add address validation
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="form-classic">
        <FormInput
          register={register}
          type="text"
          name="address"
          placeholder="address"
          options={{
            required: { message: "need account number", value: true }
          }}
          errors={errors}
        />
        <FormInput
          register={register}
          type="select"
          name="chain"
          selectOptions={["eth", "sol", "matic", "avax"]}
          errors={errors}
        />

        <button
          className="w-32 rounded-[50px] bg-[#C943A8] p-4"
          type="submit"
          {...(submitting ? { disabled: true } : {})}
        />
      </form>
    </div>
  )
}
export default NewAddress
