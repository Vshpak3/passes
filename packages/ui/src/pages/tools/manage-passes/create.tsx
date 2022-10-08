import { useRouter } from "next/router"
import { CreatePassForm, SelectPassType } from "src/components/organisms"
import { PassTypeEnum } from "src/hooks/useCreatePass"
import { withPageLayout } from "src/layout/WithPageLayout"

const PASS_TYPES = [PassTypeEnum.LIFETIME, PassTypeEnum.SUBSCRIPTION]

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

export default withPageLayout(CreatePass, { creatorOnly: true })
