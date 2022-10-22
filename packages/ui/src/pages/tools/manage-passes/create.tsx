import { PassDtoTypeEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import { CreatePassForm } from "src/components/organisms/passes/CreatePassForm"
import { SelectPassType } from "src/components/organisms/passes/SelectPassType"
import { queryParam } from "src/helpers/query"
import { WithNormalPageLayout } from "src/layout/WithNormalPageLayout"

const PASS_TYPES: string[] = [
  PassDtoTypeEnum.Lifetime,
  PassDtoTypeEnum.Subscription
]

const CreatePass = () => {
  const router = useRouter()

  const passType = queryParam(router.query.passType) || ""
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
