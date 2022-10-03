import { PassApi, PassHolderDto } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, Input } from "src/components/atoms"
import { ButtonTypeEnum, TabButton } from "src/components/atoms/Button"
import {
  MyPassGrid,
  MyPassSearchHeader
} from "src/components/molecules/passes/MyPasses"
import CreatorOnlyWrapper from "src/components/wrappers/CreatorOnly"
import { useOnClickOutside, usePasses, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

const ManagePasses = () => {
  const { user } = useUser()
  const {
    filteredActive,
    filteredCreatorPassesList,
    passSearchTerm,
    filteredExpired,
    onSearchPass,
    setPassType,
    passType
  } = usePasses(user?.id ?? "")
  const CREATE_NEW_PASS_PATH = "/tools/manage-passes/create"
  const router = useRouter()
  const editWindow = useRef(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [passId, setPassId] = useState("")

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm()

  useOnClickOutside(editWindow, () => {
    modalToggle()
    setPassId("")
  })

  const handleCreateNewPass = () => router.push(CREATE_NEW_PASS_PATH)

  const modalToggle = () => setIsDialogOpen((prevState) => !prevState)

  const onEditPassHandler = ({ passId, title, description }: PassHolderDto) => {
    setValue("title", title)
    setValue("description", description)
    setPassId(passId)
    modalToggle()
  }

  const submitHandler = () => {
    const api = new PassApi()
    api
      .updatePass({
        passId: passId,
        updatePassRequestDto: {
          title: getValues("title"),
          description: getValues("description")
        }
      })
      .catch(({ message }) => toast.error(message as string))
    setIsDialogOpen(false)
    setPassId("")
  }

  return (
    <CreatorOnlyWrapper isPage>
      <div
        className="
          relative
          mx-auto
          mb-[70px]
          grid
          w-full
          bg-black
          px-2
          md:px-5
          sidebar-collapse:max-w-[1100px]"
      >
        <MyPassSearchHeader
          onSearchPass={onSearchPass}
          passSearchTerm={passSearchTerm}
          headerTitle="Manage Passes"
        />
        {isDialogOpen && (
          <form
            ref={editWindow}
            onSubmit={handleSubmit(submitHandler)}
            className="
              absolute
              top-[50%]
              left-[50%]
              z-[2]
              m-auto
              w-[500px]
              translate-x-[-50%]
              translate-y-[-50%]
              rounded-[25px]
              bg-[#1b141d]
              p-4
              md:border-[#ffffff]/10"
          >
            <span className="my-[17px] block text-[#BF7AF0]">
              Change Pass Name
            </span>
            <Input
              register={register}
              name="title"
              type="text"
              className="border border-[#2C282D] bg-[#100C11]"
              placeholder="Pass name"
              errors={errors.title}
              options={{
                required: { message: "need title", value: true }
              }}
            />
            <span className="my-[17px] block text-[#BF7AF0]">
              Change Pass Description
            </span>
            <Input
              register={register}
              name="description"
              type="text"
              className="border border-[#2C282D] bg-[#100C11]"
              placeholder="Pass description"
              errors={errors.description}
              options={{
                required: { message: "need description", value: true }
              }}
            />
            <div className="mt-[27px] flex items-center justify-end">
              <TabButton className="h-[45px]w-[174px]" variant="white-outline">
                Preview this Pass
              </TabButton>
              <div className="ml-[10px] w-[96px]">
                <Button
                  tag="button"
                  type={ButtonTypeEnum.SUBMIT}
                  variant="pink"
                >
                  Create
                </Button>
              </div>
            </div>
          </form>
        )}
        <MyPassGrid
          activePasses={filteredActive}
          creatorPasses={filteredCreatorPassesList}
          passType={passType}
          setPassType={setPassType}
          expiredPasses={filteredExpired}
          onEditPassHandler={onEditPassHandler}
          handleCreateNewPass={handleCreateNewPass}
          isCreator
        />
      </div>
    </CreatorOnlyWrapper>
  )
}

export default withPageLayout(ManagePasses)
