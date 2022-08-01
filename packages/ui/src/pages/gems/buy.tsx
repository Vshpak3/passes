import { GemApi, GemPackageEntityDto } from "@passes/api-client"
import { useEffect, useState } from "react"

const GemSelection = () => {
  const [packages, setPackages] = useState([] as GemPackageEntityDto[])
  useEffect(() => {
    const fetchData = async () => {
      const api = new GemApi()
      const packages = await api.gemGetPublicPackages()
      console.log(packages)
      packages.sort((a, b) => {
        return a.cost - b.cost
      })
      setPackages(packages)
    }
    fetchData()
  }, [setPackages])
  return (
    <div>
      {packages.map((value, index) => {
        return (
          <button
            onClick={() => {
              window.location.href = "/gems/pay?package=" + value.title
            }}
            key={index}
          >
            {value.title} <br></br>${value.cost / 100} <br></br>
            {value.baseGems}(+{value.bonusGems}) gems<br></br>
            {value.description}
            <br></br>
            <br></br>
          </button>
        )
      })}
    </div>
  )
}
export default GemSelection
