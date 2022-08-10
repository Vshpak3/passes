import { ConfigurationParameters } from './runtime'

if (process.env.NEXT_PUBLIC_API_BASE_URL === undefined) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set")
}

export const passesConfig: ConfigurationParameters = {
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL
}
