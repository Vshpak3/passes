import React from "react"

interface IFormContainer {
  children: React.ReactNode
}

const FormContainer = ({ children }: IFormContainer) => {
  // items-center -> items-start
  return (
    <div className="flex min-h-[360px] flex-grow flex-col items-stretch gap-4 rounded-[20px] bg-[#1b141d]/50 px-5 pb-5 pt-8 backdrop-blur-[100px] md:border md:border-[#ffffff]/10">
      {children}
    </div>
  )
}

export default FormContainer
