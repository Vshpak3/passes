import { FC, PropsWithChildren, Provider } from "react"

interface AppProvidersProps {
  providers: Array<[Provider<any>, Record<string, any>]>
}

export const AppProviders: FC<PropsWithChildren<AppProvidersProps>> = ({
  children,
  providers
}) => {
  return providers.reduceRight(
    (accumulator: any, [Provider, props]) => (
      <Provider value={props}>{accumulator}</Provider>
    ),
    children
  )
}
