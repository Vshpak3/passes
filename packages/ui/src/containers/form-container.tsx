import React from "react"

interface IFormContainer {
  children: React.ReactNode
}

export const FormContainer = ({ children }: IFormContainer) => {
  // items-center -> items-start
  return (
    <div className="flex min-h-[360px] flex-grow flex-col items-stretch gap-4 rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-5 pt-8 pb-5 backdrop-blur-[100px]">
      {children}
    </div>
  )
}
