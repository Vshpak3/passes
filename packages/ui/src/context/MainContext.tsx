import { createContext, ReactNode, SetStateAction, useState } from "react"

type PropsType = {
  children: ReactNode
}

type ContextType = {
  postTime?: any
  setPostTime: React.Dispatch<SetStateAction<any>>
}

export const MainContext = createContext<ContextType>({
  postTime: null,
  setPostTime: () => null
})

export const MainContextProvider = ({ children }: PropsType) => {
  const [postTime, setPostTime] = useState(null)

  return (
    <MainContext.Provider
      value={{
        postTime,
        setPostTime
      }}
    >
      {children}
    </MainContext.Provider>
  )
}
