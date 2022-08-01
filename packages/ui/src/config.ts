import { Configuration } from "@passes/api-client"

export const API_CONFIG = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
})
