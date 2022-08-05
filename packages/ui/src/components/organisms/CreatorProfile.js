import NextHead from "next/head"
import { useState } from "react"
import { Button, Link, Separator, Text } from "src/components/atoms"
import {
  AnimatedHeart,
  Avatar,
  GrainyBackground
} from "src/components/molecules"
import { NFTPass, Popover } from "src/components/organisms"
import ChatBubble from "src/icons/chat-bubble"
import CheckVerified from "src/icons/check-verified"
import Envelope from "src/icons/envelope"
import List from "src/icons/list"
import Lock from "src/icons/lock"
import Money from "src/icons/money"
import Social from "src/icons/social"
import Star from "src/icons/star"
import ViewGrid from "src/icons/view-grid"

const mockData = {
  avatarUrl: "/andrea-botez/avatar.jpeg",
  name: "Andrea Botez",
  username: "andreabotez",
  bio: "Welcome to my Moment, a casual page for fans who want to get to know me better. I share stream & other content updates, candid photos of myself or my travels, and random daily thoughts. Thank you for supporting me 💞",
  links: {
    youtube: "Botezlive",
    twitch: "botezlive",
    instagram: "itsandreabotez",
    tiktok: "andreabotez"
  },
  popularPictures: [
    "/andrea-botez/0.png",
    "/andrea-botez/1.png",
    "/andrea-botez/2.png",
    "/andrea-botez/3.png",
    "/andrea-botez/4.png",
    "/andrea-botez/5.png",
    "/andrea-botez/6.png",
    "/andrea-botez/7.png",
    "/andrea-botez/8.png",
    "/andrea-botez/9.png",
    "/andrea-botez/10.png",
    "/andrea-botez/11.png"
  ],
  fanWallPictures: [
    "/andrea-botez/fanwall/1.png",
    "/andrea-botez/fanwall/2.png",
    "/andrea-botez/fanwall/3.png"
  ]
}

const CreatorProfile = () => {
  const [subscribed, setSubscribed] = useState(null)
  const [tab, setTab] = useState("Pass")
  const [view, setView] = useState("Grid")

  return (
    <>
      <NextHead>
        <link
          key="favicon"
          rel="shortcut icon"
          sizes="any"
          href={mockData.avatarUrl}
        />
        <link
          key="favicon-32"
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={mockData.avatarUrl}
        />
        <link
          key="favicon-16"
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={mockData.avatarUrl}
        />
      </NextHead>
      <div className="fade-in px-8 xl:px-16">
        <div className="flex w-full flex-col gap-2 pt-[54px] lg:flex-row lg:gap-8 xl:gap-12 xl:pt-[unset]">
          <div className="lg:mb-none relative mb-4 mt-8 w-fit scale-75 self-center px-4 lg:mt-28 lg:mb-8 lg:scale-100 lg:self-start">
            <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-pink-pink9 opacity-10 blur-xl dark:bg-pinkDark-pink9/50" />
            <div className="absolute inset-0 h-48 w-48 rounded-full bg-purple-purple9 opacity-20 blur-xl dark:bg-purpleDark-purple9/50" />
            <div className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-crimson-crimson9 opacity-10 blur-xl dark:bg-crimsonDark-crimson9/50" />
            <div className="relative grid place-items-center">
              <div className="absolute h-64 w-64 rounded-full border border-mauve-mauve6 bg-white/30 backdrop-blur dark:border-mauveDark-mauve6 dark:bg-black/30" />
              <Avatar src={mockData.avatarUrl} />
            </div>
            <div className="absolute -top-4 left-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#C13584] bg-mauve-mauve1 text-[#C13584] backdrop-blur-md hover:bg-[#C13584]/80 hover:text-white dark:bg-black dark:hover:bg-[#C13584]/80">
              <Social variant="Instagram" />
            </div>
            <div className="absolute inset-x-0 -top-12 mx-auto grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#FF0000]/60 bg-mauve-mauve1 text-[#FF0000] backdrop-blur-md hover:bg-[#FF0000]/80 hover:text-white dark:bg-black dark:hover:bg-[#FF0000]/80">
              <Social variant="YouTube" />
            </div>
            <div className="absolute -top-4 right-0 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#9146FF] bg-mauve-mauve1 text-[#9146FF] backdrop-blur-md hover:bg-[#9146FF] hover:text-white dark:bg-black dark:hover:bg-[#9146FF]">
              <Social variant="Twitch" />
            </div>
            <div className="absolute right-11 -top-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-[#5865F2] bg-mauve-mauve1 text-[#5865F2] backdrop-blur-md hover:bg-[#5865F2] hover:text-white dark:bg-black dark:hover:bg-[#5865F2]">
              <Social variant="Discord" />
            </div>
            <div className="dark:hover-grayDark-gray10 absolute left-11 -top-10 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-black bg-mauve-mauve1 text-black hover:bg-black/80 hover:text-white dark:border-grayDark-gray10 dark:bg-black/80 dark:text-grayDark-gray10 dark:hover:bg-grayDark-gray10 dark:hover:text-white">
              <Social variant="Tiktok" />
            </div>
          </div>
          <div className="ml-2 flex w-full max-w-md flex-col gap-2 self-center lg:my-16 lg:max-w-xs lg:self-start">
            <Text
              style={{ lineHeight: 1 }}
              className="flex items-center justify-center font-semibold lg:justify-start"
              tag="h1"
              fontSize={32}
            >
              <span className="inline-flex items-center gap-2 px-1">
                <span className="truncate">{mockData.name}</span>{" "}
                <Popover
                  title={
                    <span className="flex items-center space-x-1">
                      <CheckVerified width={28} height={28} />
                      <span>Verified Creator</span>
                    </span>
                  }
                  description={
                    <span>This creator has been verified by Moment staff.</span>
                  }
                  trigger={
                    <span className="min-w-fit" title="Verified Creator">
                      <CheckVerified width={28} height={28} />
                    </span>
                  }
                />
              </span>
            </Text>
            <Text
              className="dark:text-black1 px-1 text-center font-medium text-mauve-mauve11 lg:text-left"
              fontSize={18}
            >
              @{mockData.username}
            </Text>
            {subscribed ? (
              <div className="flex h-fit max-h-52 flex-col overflow-y-auto px-1">
                <div className="flex flex-col items-stretch">
                  <Button
                    className="mt-2 mb-4 !px-6 !py-5 font-medium"
                    variant="gradient"
                    fontSize={17}
                  >
                    <Money width={17} height={17} /> <span>Send a Tip</span>
                  </Button>
                  <Button
                    className="mb-5 !px-6 !py-5 font-medium"
                    variant="inner-gradient"
                    fontSize={17}
                  >
                    <Envelope
                      width={17}
                      height={17}
                      className="text-pink-pink9 group-hover:text-white group-active:text-black dark:group-hover:text-black dark:group-active:text-white"
                    />
                    <span className="via-purple-purple-9 dark:via-purpleDark-purple-9 flex gap-2 bg-gradient-to-r from-pink-pink9 to-plum-plum9 bg-clip-text p-px text-transparent group-hover:bg-mauve-mauve1 group-hover:from-white group-hover:via-white group-hover:to-white group-active:text-black dark:from-pinkDark-pink9 dark:to-plumDark-plum9 dark:group-hover:from-black dark:group-hover:via-black dark:group-hover:to-black dark:group-active:bg-black dark:group-active:text-white">
                      Send a Message
                    </span>
                  </Button>
                </div>
                <Button
                  onClick={() => setSubscribed(!subscribed)}
                  className="self-center font-medium text-mauve-mauve11 dark:text-mauveDark-mauve11"
                >
                  UNSUBSCRIBE
                </Button>
              </div>
            ) : (
              <div className="flex h-fit flex-col overflow-y-auto px-1">
                <Button
                  onClick={() => setSubscribed(!subscribed)}
                  className="mt-2 mb-3 !px-5 !py-6 font-medium"
                  variant="primary"
                  fontSize={17}
                >
                  SUBSCRIBE
                </Button>
                <Text className="mt-1 text-mauve-mauve12 dark:text-mauveDark-mauve12">
                  {mockData.bio}
                </Text>
              </div>
            )}
          </div>
          <Separator className="my-6 block !w-[unset] lg:hidden" />
          <Separator
            className="hidden !h-[unset] lg:block"
            orientation="vertical"
          />
          <div className="relative mb-16 mt-4 grid h-full w-full grid-flow-col grid-rows-2 gap-2 lg:mt-16">
            {[...Array(6)].map((_, index) => (
              <div className="relative" key={index}>
                <div
                  style={{
                    backgroundImage: `url(${mockData.popularPictures[index]})`
                  }}
                  className="h-36 w-full rounded bg-mauve-mauve6 bg-cover bg-no-repeat dark:bg-mauveDark-mauve6"
                />
                {index > 0 && (
                  <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-mauve-mauve4 dark:bg-mauveDark-mauve4">
                    <Popover
                      title={
                        <span className="flex items-center space-x-1">
                          <Lock width={20} height={20} />
                          <span>Locked Post</span>
                        </span>
                      }
                      description={
                        <span>
                          You must purchase a pass to get access to this locked
                          post.
                        </span>
                      }
                      trigger={<Lock width={16} height={16} />}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fade-in">
        <div className="border-y border-mauve-mauve6 dark:border-mauveDark-mauve6">
          <div className="flex w-full items-center">
            <button
              onClick={() => setTab("Fan")}
              className={
                "flex grow flex-col items-center py-8 px-2" +
                (tab === "Fan"
                  ? " bg-mauve-mauve3 dark:bg-mauveDark-mauve3"
                  : "")
              }
            >
              <Text
                className={
                  "font-semibold text-mauve-mauve11 dark:text-mauveDark-mauve11" +
                  (tab === "Fan"
                    ? " !text-mauve-mauve12 dark:!text-mauveDark-mauve12"
                    : "")
                }
              >
                Fan Wall
              </Text>
            </button>
            <div className="self-stretch">
              <Separator orientation="vertical" />
            </div>
            <button
              onClick={() => setTab("Pass")}
              className={
                "flex grow flex-col items-center py-8 px-2" +
                (tab === "Pass"
                  ? " bg-mauve-mauve3 dark:bg-mauveDark-mauve3"
                  : "")
              }
            >
              <Text
                className={
                  "font-semibold text-mauve-mauve11 dark:text-mauveDark-mauve11" +
                  (tab === "Pass"
                    ? " !text-mauve-mauve12 dark:!text-mauveDark-mauve12"
                    : "")
                }
              >
                Get a Pass
              </Text>
            </button>
            <div className="self-stretch">
              <Separator orientation="vertical" />
            </div>
            <button
              onClick={() => setTab("Private")}
              className={
                "flex grow flex-col items-center py-8 px-2" +
                (tab === "Private"
                  ? " bg-mauve-mauve3 dark:bg-mauveDark-mauve3"
                  : "")
              }
            >
              <Text
                className={
                  "font-semibold text-mauve-mauve11 dark:text-mauveDark-mauve11" +
                  (tab === "Private"
                    ? " !text-mauve-mauve12 dark:!text-mauveDark-mauve12"
                    : "")
                }
              >
                Private
              </Text>
            </button>
          </div>
        </div>
      </div>
      <div className="fade-in w-full">
        {tab === "Fan" ? (
          <div className="mx-auto mb-12 mt-8 w-fit">
            <div className="flex gap-4">
              <button
                onClick={() => setView("Grid")}
                className={
                  "flex items-center gap-1.5 py-2" +
                  (view === "Grid"
                    ? " border-b-2 border-b-mauve-mauve11 text-mauve-mauve12 dark:border-b-mauveDark-mauve11 dark:text-mauveDark-mauve12"
                    : " text-mauve-mauve11 dark:text-mauve-mauve11")
                }
              >
                <ViewGrid /> Grid
              </button>
              <button
                onClick={() => setView("List")}
                className={
                  "flex items-center gap-1.5 py-2" +
                  (view === "List"
                    ? " border-b-2 border-b-mauve-mauve11 text-mauve-mauve12 dark:border-b-mauveDark-mauve11 dark:text-mauveDark-mauve12"
                    : " text-mauve-mauve11 dark:text-mauve-mauve11")
                }
              >
                <List />
                List
              </button>
            </div>
          </div>
        ) : null}
        <div className="relative flex min-h-fit w-full justify-center">
          {tab === "Pass" ? (
            <>
              <div className="relative z-10 flex flex-wrap justify-center gap-16 overflow-x-hidden pt-24 pb-24 lg:gap-8">
                <NFTPass
                  avatarUrl={mockData.avatarUrl}
                  passUrl="https://doodleipsum.com/700/abstract?i=cb0515299c600124805d923f3619c1ad"
                  number={16}
                />
                <NFTPass
                  avatarUrl={mockData.avatarUrl}
                  passUrl="https://doodleipsum.com/700/abstract?i=62b9bf684a49d29f97e9a2bad56b5403"
                  number={17}
                />
                <NFTPass
                  avatarUrl={mockData.avatarUrl}
                  passUrl="https://doodleipsum.com/700/abstract?i=bca1e8588e68e8c73a6b721edae668c9"
                  number={18}
                />
              </div>
              <GrainyBackground />
            </>
          ) : tab === "Fan" ? (
            <div
              className={
                view === "Grid"
                  ? "relative grid w-full grid-cols-2 gap-2 px-2 pb-16 lg:flex lg:flex-wrap lg:justify-center lg:gap-8 lg:px-4"
                  : "relative flex w-full max-w-3xl flex-col justify-center gap-8 px-4 pb-16 lg:px-8"
              }
            >
              {[...Array(12)].map((_, index) => (
                <div
                  className={
                    "group relative h-fit rounded-lg border border-mauve-mauve6 bg-mauve-mauve2 p-2 pb-4 dark:border-mauveDark-mauve6 dark:bg-mauveDark-mauve2 sm:p-6 sm:pt-4" +
                    (view === "Grid" ? " lg:w-96" : " w-full")
                  }
                  tabIndex={0}
                  key={index}
                >
                  <div className="absolute -right-3 -top-3 z-10 hidden rotate-12 text-purple-purple10 dark:text-purpleDark-purple10 lg:block">
                    <Popover
                      title={
                        <span className="flex items-center space-x-1 text-purple-purple10 dark:text-purpleDark-purple10">
                          <Star width={28} height={28} />
                          <span>Creator Post</span>
                        </span>
                      }
                      description={
                        <span>
                          This post was posted by the creator of this Moment
                          Page.
                        </span>
                      }
                      trigger={
                        <Star width={42} height={42} title="Creator Post" />
                      }
                    />
                  </div>
                  <div className="relative flex h-full w-full flex-col items-stretch">
                    <Text
                      className="mb-4 hidden pr-8 text-mauve-mauve12 dark:text-mauveDark-mauve12 sm:block"
                      fontSize={13}
                    >
                      This is a caption intended to grab your attention!! I love
                      my fans and want you all to engage!
                    </Text>
                    <div
                      style={{
                        backgroundImage: `url(${mockData.popularPictures[index]})`
                      }}
                      className="aspect-[600/600] w-full grow rounded bg-cover bg-no-repeat"
                    />
                    <div className="flex items-center justify-between text-mauve-mauve11 dark:text-mauveDark-mauve11">
                      <div
                        className={
                          "flex items-center gap-2 lg:gap-4" +
                          (view === "Grid"
                            ? " hidden sm:flex"
                            : " hidden xxs:flex")
                        }
                      >
                        <AnimatedHeart height={20} width={20} />
                        <div className="mb-0.5 grid h-11 w-11 cursor-pointer place-items-center">
                          <ChatBubble height={20} width={20} />
                        </div>
                      </div>
                      <div
                        className={
                          "mb-0.5 grid h-11 w-11 cursor-pointer place-items-center" +
                          (view === "Grid"
                            ? " mx-auto sm:mx-[unset]"
                            : " mx-auto xxs:mx-[unset]")
                        }
                      >
                        <Money height={20} width={20} />
                      </div>
                    </div>
                    <Separator />
                    <div className="relative mt-4 flex flex-col items-center gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
                      <div className="relative flex items-end gap-2">
                        <Avatar
                          className="!mx-[unset] !h-10 !w-10"
                          src={mockData.avatarUrl}
                        />
                        <span
                          className={
                            "flex-col" +
                            (view === "Grid"
                              ? " hidden sm:flex"
                              : " hidden xxs:flex")
                          }
                        >
                          <Link
                            className="flex items-center gap-1"
                            href={`/${mockData.username}`}
                            variant="underline"
                          >
                            <Text fontSize={16}>{mockData.name}</Text>
                            <CheckVerified width={16} height={16} />
                          </Link>
                          <Text
                            className="text-mauve-mauve11 dark:text-mauveDark-mauve11"
                            fontSize={13}
                          >
                            @{mockData.username}
                          </Text>
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-center lg:text-right">
                        <span className="flex items-center gap-1 text-purple-purple10 dark:text-purpleDark-purple10">
                          <Text className="font-medium" fontSize={13}>
                            Creator
                          </Text>
                          <Star width={13} height={13} />
                        </span>
                        <Text
                          className="text-mauve-mauve12 dark:text-mauveDark-mauve12"
                          fontSize={13}
                        >
                          6/9/22
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : tab === "Private" ? (
            <div style={{ height: 800 }} />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default CreatorProfile
