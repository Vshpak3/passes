import {
  GetPassHoldingsRequestDtoOrderTypeEnum,
  PassApi,
  PassDto
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { useUser } from "src/hooks"
import useSWR from "swr"

function filterPasses(expired = true) {
  return (pass: PassDto) => {
    const currentDate = Date.now()
    const expiryDate =
      pass.createdAt &&
      new Date(pass.createdAt).getMilliseconds() + Number(pass.duration)
    if (expiryDate) {
      return expired ? currentDate < expiryDate : currentDate > expiryDate
    }
    return false
  }
}
function filterPassesByTitle(searchTerm: string) {
  return (item: PassDto) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
}
function filterPassesByType(type: string) {
  return (item: PassDto | undefined) => {
    if (type === "all") return true
    return item?.type.toLowerCase() === type.toLowerCase()
  }
}

const usePasses = (creatorId = "") => {
  const { user } = useUser()
  const { data: creatorPasses = [], isValidating: isLoadingCreatorPasses } =
    useSWR(user ? ["/pass/created/", creatorId] : null, async () => {
      if (user) {
        const api = new PassApi()
        return (
          await api.getCreatorPasses({
            getCreatorPassesRequestDto: { creatorId }
          })
        ).passes
      }
    })

  const { data: fanPasses, isValidating: isLoadingFanPasses } = useSWR(
    user ? "/pass/passholdings" : null,
    async () => {
      const api = new PassApi()
      return (
        await api.getPassHoldings({
          getPassHoldingsRequestDto: {
            order: "desc",
            orderType: GetPassHoldingsRequestDtoOrderTypeEnum.CreatedAt
          }
        })
      ).passHolders
    }
  )

  const { data: externalPasses = [], isValidating: isLoadingExternalPasses } =
    useSWR(user ? "/pass/external" : null, async () => {
      const api = new PassApi()
      return (
        await api.getExternalPasses({
          getExternalPassesRequestDto: {
            creatorId: user?.id
          }
        })
      ).passes
    })

  const [filteredActive, setFilteredActive] = useState(creatorPasses)
  const [filteredExpired, setFilteredExpired] = useState(creatorPasses)
  const [filteredCreatorPassesList, setFilteredCreatorPassesList] =
    useState(creatorPasses)

  const [passType, setPassType] = useState("all")
  const [passSearchTerm, setPassSearchTerm] = useState("")

  const onSearchPass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassSearchTerm(event.target.value)
  }

  useEffect(() => {
    const filterActivePasses = creatorPasses
      .filter(filterPasses(true))
      .filter(filterPassesByTitle(passSearchTerm))
      .filter(filterPassesByType(passType))
    setFilteredActive(filterActivePasses)
    const filterExpiredPasses = creatorPasses
      .filter(filterPasses(false))
      .filter(filterPassesByTitle(passSearchTerm))
      .filter(filterPassesByType(passType))
    setFilteredExpired(filterExpiredPasses)
    const filteredCreatorPasses = creatorPasses
      .filter(filterPasses(false))
      .filter(filterPassesByTitle(passSearchTerm))
      .filter(filterPassesByType(passType))
    setFilteredCreatorPassesList(filteredCreatorPasses)
  }, [passType, passSearchTerm, creatorPasses])

  return {
    passType,
    filteredActive,
    filteredCreatorPassesList,
    creatorPasses,
    externalPasses,
    filteredExpired,
    fanPasses,
    isLoadingFanPasses,
    isLoadingExternalPasses,
    isLoadingCreatorPasses,
    passSearchTerm,
    onSearchPass,
    setPassType
  }
}

export default usePasses
