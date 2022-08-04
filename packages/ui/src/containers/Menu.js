import * as Portal from "@radix-ui/react-portal"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Separator, Text, Wordmark } from "src/components/atoms"
import Arrow from "src/icons/arrow"
import ChatBubble from "src/icons/chat-bubble"
import Cross from "src/icons/cross"
import Exit from "src/icons/exit"
import Gear from "src/icons/gear"
import HamburgerMenu from "src/icons/hamburger-menu"
import Home from "src/icons/home"
import IdCard from "src/icons/id-card"
import Money from "src/icons/money"
import Stack from "src/icons/stack"

export const MenuPortal = () => {
  const router = useRouter()
  const [hamburger, setHamburger] = useState(false)

  useEffect(() => {
    setHamburger(false)
  }, [router.asPath])

  useEffect(() => {
    if (hamburger) {
      document.getElementById("__next").style.display = "none"
    }

    return () => {
      document.getElementById("__next").style.display = "block"
    }
  }, [hamburger])

  return (
    <>
      <header className="fixed top-0 z-10 block w-full min-w-[300px] bg-white/80 saturate-100 backdrop-blur dark:bg-black/80 xl:hidden">
        <div className="big-container flex w-full items-center justify-between py-1">
          <button
            onClick={() => setHamburger(true)}
            className="dark:mauveDark-mauve12 flex items-center gap-3 rounded-full p-3 text-mauve-mauve12 transition-colors hover:bg-mauve-mauve3 dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve3"
          >
            <HamburgerMenu width={22} height={22} />
          </button>
          <button onClick={() => signOut()} className={"flex h-fit flex-col"}>
            <div className="dark:hovertext-mauveDark-mauve12 flex items-center gap-2 text-mauve-mauve11 transition-colors hover:text-mauve-mauve12 dark:text-mauveDark-mauve11">
              <Text className="hidden sm:inline-block" fontSize={14}>
                Logout
              </Text>
              <span className="hidden sm:inline-block">
                <Exit />
              </span>
              <span className="inline-block sm:hidden">
                <Exit width={18} height={18} />
              </span>
            </div>
          </button>
        </div>
        <Separator />
      </header>
      {hamburger && (
        <Portal.Root className="h-full w-full">
          <div className="absolute flex h-full w-full flex-col bg-mauve-mauve1 py-8 dark:bg-black">
            <div className="flex flex-col">
              <div className="flex justify-center">
                <Wordmark height={28} width={122} />
              </div>
              <div className="mt-16 flex flex-col items-center">
                {[
                  "Home",
                  "Messages",
                  "Passes",
                  "Payments",
                  "Following",
                  "Settings"
                ].map((item, index) => (
                  <button
                    onClick={() => router.push(`/${item.toLowerCase()}`)}
                    className={
                      "flex w-full grow flex-col items-center py-4 pl-12 pr-14 hover:bg-mauve-mauve3 hover:dark:bg-mauveDark-mauve3"
                    }
                    key={index}
                  >
                    <div className="w-36 overflow-x-visible">
                      <div className="flex items-center justify-center gap-3 text-mauve-mauve12 dark:text-mauveDark-mauve12 sm:ml-4 sm:justify-start">
                        <div className="min-w-fit">
                          {item === "Home" ? (
                            <Home width={20} height={20} />
                          ) : item === "Messages" ? (
                            <ChatBubble width={20} height={20} />
                          ) : item === "Passes" ? (
                            <Stack width={20} height={20} />
                          ) : item === "Payments" ? (
                            <Money width={20} height={20} />
                          ) : item === "Settings" ? (
                            <Gear width={20} height={20} />
                          ) : item === "Following" ? (
                            <IdCard width={20} height={20} />
                          ) : null}
                        </div>
                        <Text fontSize={20} className="font-medium">
                          {item}
                        </Text>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 flex grow flex-col justify-end">
              <button
                onClick={() => setHamburger(false)}
                className={
                  "flex h-fit justify-center py-4 px-16 hover:bg-mauve-mauve3 hover:dark:bg-mauveDark-mauve3"
                }
              >
                <div className="flex items-center gap-2 text-mauve-mauve11 dark:text-mauveDark-mauve11">
                  <Cross />
                  <Text className={"font-medium"}>Close</Text>
                </div>
              </button>
            </div>
          </div>
        </Portal.Root>
      )}
    </>
  )
}

const Menu = () => {
  const router = useRouter()

  return (
    <div className="relative hidden min-h-screen min-w-fit flex-col border-r border-r-mauve-mauve6 first-letter:hidden dark:border-r-mauveDark-mauve6 xl:flex">
      <div className="sticky top-0 flex h-full max-h-screen w-full flex-col py-8">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Wordmark height={28} width={122} />
          </div>
          <div className="mt-16 flex flex-col">
            {[
              "Home",
              "Messages",
              "Passes",
              "Payments",
              "Following",
              "Settings"
            ].map((item, index) => (
              <button
                onClick={() => router.push(`/${item.toLowerCase()}`)}
                className={
                  "flex grow flex-col py-4 pl-12 pr-14 hover:bg-mauve-mauve3 hover:dark:bg-mauveDark-mauve3"
                }
                key={index}
              >
                <div className="flex items-center gap-3 text-mauve-mauve12 dark:text-mauveDark-mauve12">
                  {item === "Home" ? (
                    <Home />
                  ) : item === "Messages" ? (
                    <ChatBubble />
                  ) : item === "Passes" ? (
                    <Stack />
                  ) : item === "Payments" ? (
                    <Money />
                  ) : item === "Settings" ? (
                    <Gear />
                  ) : item === "Following" ? (
                    <IdCard />
                  ) : null}
                  <Text className={"font-medium"}>{item}</Text>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 flex grow flex-col justify-end">
          <button
            onClick={() => signOut()}
            className={
              "flex h-fit flex-col py-4 px-16 hover:bg-mauve-mauve3 hover:dark:bg-mauveDark-mauve3"
            }
          >
            <div className="flex items-center gap-2 text-mauve-mauve11 dark:text-mauveDark-mauve11">
              <Arrow variant="left" />
              <Text className={"font-medium"}>Logout</Text>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
export default Menu
