import { useRouter } from "next/router"
import EnterIcon from "public/icons/enter-icon.svg"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput, Text, Wordmark } from "src/components/atoms"

interface NewPasswordFormProps {
  password: string
  confirmPassword: string
}

const NewPassword = () => {
  const router = useRouter()

  const [emailSent, setEmailSent] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<NewPasswordFormProps>()

  const onSubmit = (data: object) => {
    console.log("DATA", data)
    setEmailSent(true)
  }

  const passwordValidation = {
    minLength: {
      value: 8,
      message: "Minimum eight characters"
    },
    pattern: {
      value: /^(?=.*\d)(?=.*[a-zA-Z])(?=\S+$).{8,}$/,
      message: "Must include at least one letter and one number"
    }
  }

  return (
    <div className=" flex h-screen flex-1 flex-col bg-black px-0 pt-6 lg:px-20">
      <Wordmark
        whiteOnly={true}
        height={28}
        width={122}
        className="z-10 self-center lg:self-start"
      />
      <div className="absolute left-0 top-0 h-[300px] w-full bg-[#1b141d] bg-[url('/userInfoBackground.png')] bg-cover opacity-[50] backdrop-blur-[164px]"></div>
      <div className="z-10 flex justify-center md:mt-20 lg:my-auto">
        <div className="mt-20 flex flex-col items-center gap-y-5 rounded-[28px] border-[#34343a] bg-black px-[7%] py-[3%] opacity-[60] md:mt-0 md:border">
          <Text
            fontSize={36}
            className="mb-4 w-[360px] text-center font-semibold text-white"
          >
            Password Reset
          </Text>
          {emailSent ? (
            <>
              <Text className="-mt-8 flex flex-wrap text-center text-[#b3bee7] opacity-[0.6]">
                Success! Your password has been changed
              </Text>
              <button
                onClick={() => router.push("/login")}
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
              >
                <Text fontSize={16} className="font-medium">
                  Log in
                </Text>
                <EnterIcon />
              </button>
            </>
          ) : (
            <Text className="-mt-8 flex w-[360px] flex-wrap text-center text-[#b3bee7] opacity-[0.6]">
              Please enter your new password and confirm it.
            </Text>
          )}
          {!emailSent && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-5"
            >
              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  Password
                </Text>
                <FormInput
                  register={register}
                  name="password"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Enter your password"
                  type="password"
                  errors={errors}
                  options={{
                    required: true,
                    ...passwordValidation
                  }}
                />
                {errors.password && (
                  <Text fontSize={12} className="mt-1 text-[red]">
                    {errors.password.message}
                  </Text>
                )}
              </div>

              <div className="flex flex-col">
                <Text className="mb-1 text-[#b3bee7] opacity-[0.6]">
                  Confirm Password
                </Text>
                <FormInput
                  register={register}
                  name="confirmPassword"
                  className="w-[360px] border-[#34343A60] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Confirm your password"
                  type="password"
                  errors={errors}
                  options={{
                    required: true,
                    ...passwordValidation,
                    validate: (val: string) => {
                      if (watch("password") != val) {
                        return "Your passwords do not match"
                      }
                    }
                  }}
                />
                {errors.confirmPassword && (
                  <Text fontSize={12} className="mt-1 text-[red]">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </div>

              <button
                className="dark:via-purpleDark-purple-9 z-10 flex h-[44px] w-[360px] flex-row items-center justify-center gap-1 rounded-[8px] bg-gradient-to-r from-[#598BF4] to-[#B53BEC] text-white shadow-md shadow-purple-purple9/30 transition-all active:bg-purple-purple9/90 active:shadow-sm dark:from-pinkDark-pink9 dark:to-plumDark-plum9"
                type="submit"
              >
                <Text fontSize={16} className="font-medium">
                  Reset Password
                </Text>
                <EnterIcon />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewPassword
