import { PassDtoTypeEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import {
  CreatePassForm,
  SelectPassType
} from "src/components/organisms/passes/CreatePass"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const PASS_TYPES: string[] = [
  PassDtoTypeEnum.Lifetime,
  PassDtoTypeEnum.Subscription
]

const CreatePass = () => {
  const router = useRouter()

  const passType = Array.isArray(router.query.passType)
    ? router.query.passType[0]
    : router.query.passType || ""
  const isSelectPassOption = !PASS_TYPES.includes(passType)

  return (
    <>
      {isSelectPassOption ? (
        <SelectPassType />
      ) : (
        <CreatePassForm passType={passType} />
      )}
    </>
  )
}

export default WithNormalPageLayout(CreatePass, { creatorOnly: true })
