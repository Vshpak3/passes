import classNames from "classnames"
import AddNewPassIcon from "public/icons/add-new-pass.svg"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import React from "react"
import { Button } from "src/components/atoms"
import {
  MyPassTile,
  SelectPassFilter,
  SelectPassTab
} from "src/components/atoms/passes/MyPass"
import { CreatorPassTiles } from "src/components/organisms"

const MyPassSearchBar = ({ onChange, passSearchTerm }: any) => (
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

const MyPassSearchHeader = ({
  onSearchPass,
  passSearchTerm,
  headerTitle = "My Passes"
}: any) => {
  return (
    <div className="mx-auto mb-[70px] -mt-[180px] flex w-full items-center justify-center px-2 md:px-5 sidebar-collapse:-mt-[150px]">
      <div className="text-[24px] font-bold text-white">{headerTitle}</div>
      <MyPassSearchBar onChange={onSearchPass} value={passSearchTerm} />
    </div>
  )
}

const MyPassGridContainer = ({ children }: any) => (
  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 sidebar-collapse:grid-cols-4">
    {children}
  </div>
)

const MyPassGrid = ({
  activePasses,
  expiredPasses,
  setPassType,
  passType,
  creatorPasses = [],
  // modalToggle = null,
  onEditPassHandler = {},
  handleCreateNewPass = {},
  isCreator = false,
  lifetimePasses = []
}: any) => {
  const SUBSCRIPTION_TYPE = "subscription"
  const renderActivePasses = activePasses?.map((pass: any, index: any) => (
    <MyPassTile key={index} passData={pass} />
  ))
  const renderExpiredPasses = expiredPasses?.map((pass: any, index: any) => (
    <MyPassTile key={index} isExpired passData={pass} />
  ))

  const renderLifetimePasses = lifetimePasses?.map((pass: any, index: any) => (
    <MyPassTile key={index} isExpired passData={pass} />
  ))
  const renderCreatorPasses = creatorPasses?.map((pass: any, index: any) => (
    <MyPassTile
      key={index}
      passData={pass}
      passOnEditHandler={onEditPassHandler}
      isEdit
      // modalToggle={modalToggle}
    />
  ))

  return (
    <div className="w-full px-2 md:mt-6">
      <div className="md:align-items ml-1 mt-6 mb-2 items-center justify-between md:ml-0 md:mb-2 md:flex">
        <div
          className={classNames(
            isCreator ? "flex w-full items-center" : "w-fit"
          )}
        >
          {isCreator ? (
            <>
              <span className="min-w-[190px] text-[24px] font-bold text-[#ffff]/90 md:mr-4">
                Created Passes
              </span>
              <SelectPassFilter setPassType={setPassType} passType={passType} />
            </>
          ) : (
            <SelectPassTab setPassType={setPassType} passType={passType} />
          )}
          {isCreator && (
            <div className="ml-[76px] mr-[34px] h-[1px] w-full border border-[#2C282D]" />
          )}
          <span className="mt-[24px] block min-w-[190px] text-[24px] font-bold text-[#ffff]/90 md:mr-4">
            {passType === SUBSCRIPTION_TYPE && "Active subscriptions"}
          </span>
        </div>
        {isCreator && (
          <div className="flex items-center justify-between">
            <Button onClick={handleCreateNewPass} variant="purple">
              <div className="flex w-[197px] items-center justify-center text-[16px]">
                <AddNewPassIcon className="mr-[13px]" />
                Create New Pass
              </div>
            </Button>
          </div>
        )}
        <hr className="my-auto hidden grow border-passes-dark-200 md:display" />
      </div>
      {isCreator ? (
        <MyPassGridContainer>{renderCreatorPasses}</MyPassGridContainer>
      ) : (
        <>
          {passType === SUBSCRIPTION_TYPE ? (
            <>
              <MyPassGridContainer>{renderActivePasses}</MyPassGridContainer>
              <div className="mt-10 ml-1 mb-2 flex md:ml-0">
                <span className="text-[24px] font-bold text-[#ffff]/90">
                  Expired Subscriptions
                </span>
                <hr className="my-auto hidden grow border-passes-dark-200 md:display" />
              </div>
              <MyPassGridContainer>{renderExpiredPasses}</MyPassGridContainer>
            </>
          ) : (
            <MyPassGridContainer>{renderLifetimePasses}</MyPassGridContainer>
          )}
        </>
      )}
    </div>
  )
}

const CreatorPasses = ({ passes, title, alternateBg = false }: any) => {
  const renderPassesGrid = passes?.map((pass: any, index: any) => (
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
