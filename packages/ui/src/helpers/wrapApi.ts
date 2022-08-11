import * as Api from "@passes/api-client"
import { DefaultConfig } from "@passes/api-client"

// Util to handle:
// - Adding { "Content-Type": "application/json" } to the generated API
// - Adding authorization header when available in local storage
export const wrapApi = <T extends Api.BaseAPI>(api: {
  new (...args: any[]): T
}): T => {
  const configParams: Api.ConfigurationParameters = {
    basePath: DefaultConfig.basePath,
    headers: {
      "Content-Type": "application/json"
    }
  }

  if (typeof window === "undefined") {
    const config = new Api.Configuration(configParams)
    return new api(config)
  }

  const accessToken = window.localStorage.getItem("access-token")

  if (accessToken) {
    configParams.headers = {
      ...configParams.headers,
      Authorization: "Bearer " + JSON.parse(accessToken)
    }
  }

  const config = new Api.Configuration(configParams)
  return new api(config)
}
