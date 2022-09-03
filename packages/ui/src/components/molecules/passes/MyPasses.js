import SearchIcon from "public/icons/header-search-icon-2.svg"
import React from "react"
import {
  MyPassTile,
  SelectPassFilter
} from "src/components/atoms/passes/MyPass"
import { CreatorPassTiles } from "src/components/organisms"

const MyPassSearchBar = ({ onChange, passSearchTerm }) => (
  <div className="ml-auto">
    <div className="relative flex items-center">
      <SearchIcon className="pointer-events-none  absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
      <input
        type="search"
        name="search-passes"
        id="search-passes"
        onChange={onChange}
        value={passSearchTerm}
        autoComplete="off"
        placeholder="Search pass"
        className="form-input h-[51px] w-[210px] rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0 md:max-w-[250px]"
      />
    </div>
  </div>
)

const MyPassSearchHeader = ({ onSearchPass, passSearchTerm }) => {
  return (
    <div className="align-items mx-2 -mt-[180px] flex items-center justify-between md:mx-0 lg:px-0 sidebar-collapse:-mt-[150px] sidebar-collapse:w-[1100px]">
      <div className="text-[24px] font-bold text-white">My Passes</div>
      <MyPassSearchBar onChange={onSearchPass} value={passSearchTerm} />
    </div>
  )
}

const MyPassGridContainer = ({ children }) => (
  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
    {children}
  </div>
)

const MyPassGrid = ({ activePasses, expiredPasses, setPassType }) => {
  const renderActivePasses = activePasses?.map((pass, index) => (
    <MyPassTile key={index} passData={pass} />
  ))
  const renderExpiredPasses = expiredPasses?.map((pass, index) => (
    <MyPassTile key={index} isExpired passData={pass} />
  ))

  return (
    <div className="px-2 md:mt-6">
      <div className="md:align-items ml-1 mt-6 mb-2 items-center md:ml-0 md:mb-2 md:flex">
        <span className="text-[24px] font-bold text-[#ffff]/90">
          Active Subscriptions
        </span>
        <SelectPassFilter setPassType={setPassType} />
        <hr className="my-auto hidden grow border-passes-dark-200 md:display" />
      </div>
      <MyPassGridContainer>{renderActivePasses}</MyPassGridContainer>
      <div className="mt-10 ml-1 mb-2 flex md:ml-0">
        <span className="text-[24px] font-bold text-[#ffff]/90">
          Expired Subscriptions
        </span>
        <hr className="my-auto hidden grow border-passes-dark-200 md:display" />
      </div>
      <MyPassGridContainer>{renderExpiredPasses}</MyPassGridContainer>
    </div>
  )
}

const CreatorPasses = ({ passes, title, alternateBg = false }) => {
  const renderPassesGrid = passes?.map((pass, index) => (
    <CreatorPassTiles key={index} alternateBg={alternateBg} passData={pass} />
  ))

  return (
    <>
      <div className="mt-4 mb-2 flex gap-x-4">
        <span className="text-[24px] font-bold text-[#ffff]/90">{title}</span>
        <hr className="my-auto grow border-passes-dark-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 sidebar-collapse:grid-cols-3">
        {renderPassesGrid}
      </div>
    </>
  )
}

export { CreatorPasses, MyPassGrid, MyPassSearchHeader }
