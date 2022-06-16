import { useSession } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import Avatar from "src/components/avatar"
import Button from "src/components/button"
import Separator from "src/components/separator"
import Text from "src/components/text"
import Wordmark from "src/components/wordmark"
import Gear from "src/icons/gear"
import { useState } from "react"
import RadioGroup from "src/components/radio-group"
import Menu, { MenuPortal } from "src/containers/menu"

const SettingsPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [tab, setTab] = useState("Passes")

  if (session === null) {
    router.push("/", "/", { shallow: true })
  }

  return (
    <div className="relative h-full w-full bg-mauve-mauve2 dark:bg-black">
      <MenuPortal />
      <div className="flex">
        <Menu />
        <div className="grow pt-[54px] xl:pt-[unset]">
          <form className="fade-in medium-container relative bg-mauve-mauve2 py-10 dark:bg-black">
            <div className="flex w-full justify-center divide-mauve-mauve6 rounded-lg border border-gray-gray6 bg-white dark:divide-mauveDark-mauve6 dark:border-grayDark-gray6 dark:bg-mauveDark-mauve1 lg:divide-x">
              <div className="hidden w-60 flex-col lg:flex">
                {["Passes", "Notifications", "Account Profile"].map(
                  (item, index) => (
                    <button
                      onClick={(event) => {
                        event.preventDefault()
                        setTab(item)
                      }}
                      className={
                        "cursor-pointer p-4 pl-8 text-left" +
                        (tab === item
                          ? " bg-mauve-mauve3 font-bold hover:bg-mauve-mauve3 dark:border-mauveDark-mauve12 dark:bg-mauveDark-mauve3 dark:hover:bg-mauveDark-mauve3"
                          : "") +
                        (index === 0 ? " rounded-tl-lg" : "")
                      }
                      key={index}
                    >
                      {item}
                    </button>
                  )
                )}
                <div className="pt-4 pl-8 pb-8">
                  <Button
                    className="font-semibold"
                    variant="link-blue"
                    fontSize={15}
                  >
                    Contact Support
                  </Button>
                </div>
                <Separator />
                <div className="flex flex-col gap-3 pt-5 pb-8 pr-4 pl-8">
                  <Text className="font-semibold text-mauve-mauve12 dark:text-mauveDark-mauve12">
                    Moment HQ Inc.
                  </Text>
                  <Text
                    className="text-mauve-mauve11 dark:text-mauveDark-mauve11"
                    fontSize={13}
                  >
                    Thank you for using Moment. We are commited to protecting
                    your user data and privacy.
                  </Text>
                </div>
              </div>
              <div className="flex grow flex-col gap-8 pt-8">
                {tab === "Passes" ? (
                  <div>
                    <RadioGroup />
                  </div>
                ) : tab === "Notifications" ? (
                  <div></div>
                ) : tab === "Account Profile" ? (
                  <>
                    <div className="flex flex-col gap-2 px-8 sm:flex-row sm:items-center sm:gap-8 sm:px-16">
                      <label className="w-28 font-bold">Name</label>
                      <input
                        className="w-full max-w-md rounded-full border-transparent bg-mauve-mauve3 px-4 py-3 dark:bg-mauveDark-mauve3"
                        type="text"
                        defaultValue="Lucy Guo"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-8 sm:flex-row sm:items-center sm:gap-8 sm:px-16">
                      <label className="w-28 font-bold">Email</label>
                      <input
                        className="w-full max-w-md rounded-full border-transparent bg-mauve-mauve3 px-4 py-3 dark:bg-mauveDark-mauve3"
                        type="text"
                        defaultValue="lucy@boss.com"
                      />
                    </div>
                    <div className="flex flex-col gap-2 px-8 sm:flex-row sm:items-center sm:gap-8 sm:px-16">
                      <label className="w-28 font-bold">Phone Number</label>
                      <input
                        className="w-full max-w-md rounded-full border-transparent bg-mauve-mauve3 px-4 py-3 dark:bg-mauveDark-mauve3"
                        type="text"
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="flex flex-col gap-4 px-8 pb-8 pt-4 sm:flex-row sm:items-center sm:gap-8 sm:px-16">
                      <div className="w-28" />
                      <Button
                        className="!px-6 !py-5 font-medium sm:!px-12 sm:!py-4"
                        variant="primary"
                        fontSize={15}
                      >
                        Save Account
                      </Button>
                      <Button
                        className="font-medium text-mauve-mauve11 transition-colors hover:text-black dark:text-mauveDark-mauve11 dark:hover:text-white"
                        fontSize={15}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
