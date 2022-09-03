import { UserApi } from "@passes/api-client/apis"
import moment from "moment"
import { useEffect, useState } from "react"
import { default as Calendar } from "react-calendar"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, FormInput, Label, Text } from "src/components/atoms"
import Arrow from "src/icons/arrow"

import FormContainer from "../../components/organisms/FormContainer"
import { wrapApi } from "../../helpers/wrapApi"

type TFormValues = {
  username: string
  name: string
  birthday: string
  country: string
}

const AdditionalInfoBlock = () => {
  const [countries, setCountries] = useState<string[]>([])
  const [showCalendar, setShowCalendar] = useState<boolean>(false)

  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
    setError,
    setValue
  } = useForm<TFormValues>({ defaultValues: {} })

  async function verifyUsername(username = "") {
    try {
      if (username.length < 1) return

      const userAPI = wrapApi(UserApi)
      const resp = await userAPI.validateUsername({
        username
      })

      if (!resp) {
        setError("username", {
          message: "Invalid username."
        })
      }
    } catch (error: any) {
      toast.error(error)
      setError("username", {
        message: error?.message || ""
      })
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      const resp = await fetch("https://restcountries.com/v3.1/all")
        .then((response) => response.json())
        .then((data) =>
          data
            .map((item: any) => item?.name?.common)
            .sort((a: any, b: any) => a.localeCompare(b))
        )
        .catch(console.error)

      if (resp) {
        setCountries(resp)
      }
    }

    fetchCountries()
  }, [])

  function onSubmit(data: any) {
    // TODO: Integrate with backend when signup flow is done.
    console.log(data)
  }

  return (
    <div className="flex min-h-screen justify-end">
      <FormContainer className="flex max-h-[632px] flex-col items-center lg:w-[90%]">
        <div className="w-[360px] self-center">
          <div className="flex flex-col text-center">
            <Text fontSize={36} className="font-bold">
              Let&apos;s get to know each other
            </Text>
            <Text className="mb-8 text-passes-blue-200">description</Text>
          </div>
          <Label
            name="username"
            label="Username"
            className="mb-2 text-passes-blue-200"
          />
          <FormInput
            className="mb-4 border-passes-blue-200 border-opacity-80 bg-transparent ring-opacity-80 focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]"
            type="text"
            name="username"
            placeholder="Username"
            register={register}
            errors={errors}
            options={{
              onBlur: (e) => {
                verifyUsername(e.target.value)
              },
              maxLength: 30,
              pattern: /[\w.-]+/,
              required: true
            }}
          />
          <Label
            name="name"
            label="Name"
            className="mb-2 text-passes-blue-200"
          />
          <FormInput
            className="mb-4 border-passes-blue-200 border-opacity-80 bg-transparent focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]"
            type="text"
            name="name"
            placeholder="Name"
            register={register}
            errors={errors}
          />
          <Label
            name="birthday"
            label="Birthday"
            className="mb-2 text-passes-blue-200"
          />
          <div style={{ position: "relative" }}>
            <FormInput
              className="mb-4 border-passes-blue-200 border-opacity-80 bg-transparent focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]"
              type="text"
              name="birthday"
              placeholder="Birthday"
              register={register}
              errors={errors}
              value={moment(getValues("birthday")).format("L")}
              onFocus={() => {
                if (!showCalendar) setShowCalendar(true)
              }}
            />
            {showCalendar && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  zIndex: 1000
                }}
              >
                <Calendar
                  onClickDay={(value: Date) => {
                    setValue("birthday", value.toISOString())
                    setShowCalendar(false)
                  }}
                  value={new Date(getValues("birthday"))}
                />
              </div>
            )}
          </div>
          <Label
            name="country"
            label="Country"
            className="mb-2 text-passes-blue-200"
          />
          <FormInput
            className="mb-4 border-passes-blue-200 border-opacity-80 bg-transparent focus:border-[#9c4dc1cc] focus:ring-[#9c4dc1cc]"
            type="select"
            name="country"
            placeholder="Country"
            register={register}
            selectOptions={countries}
            errors={errors}
          />
          <Button
            bigger
            className="w-[360px] rounded-md py-10"
            variant="vertical-gradient"
            tag="button"
            onClick={() => handleSubmit(onSubmit)}
          >
            {"Register account"}
            <Arrow variant="right" />
          </Button>
        </div>
      </FormContainer>
    </div>
  )
}

export default AdditionalInfoBlock
