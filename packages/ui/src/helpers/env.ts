export const isDev = process.env.NEXT_PUBLIC_NODE_ENV === "dev"
export const isStaging = process.env.NEXT_PUBLIC_NODE_ENV === "stage"
export const isProd = true

// temporary
console.log(process.env)
