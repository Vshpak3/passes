import { WalletApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput } from "src/components/atoms"
import { useLocalStorage, useUser } from "src/hooks"

import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"

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
      await walletApi.createUnauthenticatedWallet(
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
    } catch (error: any) {
      toast.error(error)
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
    <AuthOnlyWrapper isPage>
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
          className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
          type="submit"
          {...(submitting ? { disabled: true } : {})}
        />
      </form>
    </AuthOnlyWrapper>
  )
}
export default NewAddress
