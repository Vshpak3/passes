import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Avatar } from 'src/components/avatar'
import { Button } from 'src/components/button'
import { Separator } from 'src/components/separator'
import { Text } from 'src/components/text'
import { Wordmark } from 'src/components/wordmark'
import { Welcome } from 'src/containers/welcome'
import { CheckVerified } from 'src/icons/check-verified'
import { Gear } from 'src/icons/gear'
import { Social } from 'src/icons/social'

const mockData = {
  avatarUrl: '/andrea-botez/avatar.jpeg',
  name: 'Andrea Botez',
  username: 'andreabotez',
  bio: 'Welcome to my Moment, a casual page for fans who want to get to know me better. I share stream & other content updates, candid photos of myself or my travels, and random daily thoughts. Thank you for supporting me 💞',
  links: {
    youtube: 'Botezlive',
    twitch: 'botezlive',
    instagram: 'itsandreabotez',
    tiktok: 'andreabotez',
  },
  popularPictures: [
    '/andrea-botez/1.png',
    '/andrea-botez/2.png',
    '/andrea-botez/3.png',
    '/andrea-botez/4.png',
    '/andrea-botez/5.png',
    '/andrea-botez/6.png',
    '/andrea-botez/7.png',
    '/andrea-botez/8.png',
    '/andrea-botez/9.png',
    '/andrea-botez/10.png',
    '/andrea-botez/11.png',
    '/andrea-botez/12.png',
  ],
}

const Username = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { username } = router.query

  return (
    <div className="relative h-full w-full">
      <header className="bg-white dark:bg-black">
        <div className="big-container flex w-full items-center justify-between py-4">
          <div>
            <Wordmark height={18} width={93} />
          </div>
          <div className="flex items-center gap-6">
            <NextLink href="/settings">
              <a className="grid h-8 w-8 place-items-center">
                <Gear width={20} height={20} />
              </a>
            </NextLink>
            <NextLink href="/subscriptions">
              <a>
                <Avatar
                  className="!h-8 !w-8"
                  src={session?.user?.image ?? ''}
                />
              </a>
            </NextLink>
          </div>
        </div>
        <Separator />
      </header>
      {username?.includes('andrea') ? (
        <div className="fade-in big-container">
          <div className="flex w-full flex-col items-center gap-2 pt-12 lg:flex-row lg:gap-12">
            <div className="lg:mb-none relative mb-4 w-fit scale-75 px-4 lg:mb-8 lg:scale-100">
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
            <div className="ml-2 flex w-full max-w-md flex-col gap-2 lg:max-w-xs">
              <Text
                style={{ lineHeight: 1 }}
                className="flex items-center justify-center gap-2 font-semibold lg:justify-start"
                tag="h1"
                fontSize={32}
              >
                <span>{mockData.name}</span>{' '}
                <span>
                  <CheckVerified width={28} height={28} />
                </span>
              </Text>
              <Text
                className="dark:text-black1 text-center font-medium text-mauve-mauve11 lg:text-left"
                fontSize={18}
              >
                @{mockData.username}
              </Text>
              <Button
                className="mt-4 mb-3 !rounded-none !px-6 !py-5 font-medium"
                variant="primary"
                fontSize={17}
              >
                SUBSCRIBE
              </Button>
              <Text className="text-mauve-mauve12 dark:text-mauveDark-mauve12">
                {mockData.bio}
              </Text>
            </div>
            <Separator className="my-6 block !w-[unset] lg:hidden" />
            <Separator
              className="hidden !h-[unset] lg:block"
              orientation="vertical"
            />
            <div className="relative grid h-full w-full grid-flow-col grid-rows-2 gap-2">
              <div
                style={{
                  backgroundImage: `url(${mockData.popularPictures[0]})`,
                }}
                className="h-36 w-full bg-mauve-mauve6 bg-cover dark:bg-mauveDark-mauve6"
              />
              <div
                style={{
                  backgroundImage: `url(${mockData.popularPictures[1]})`,
                }}
                className="h-36 w-full bg-mauve-mauve6 bg-cover blur dark:bg-mauveDark-mauve6"
              />
              <div
                style={{
                  backgroundImage: `url(${mockData.popularPictures[4]})`,
                }}
                className="h-36 w-full bg-mauve-mauve6 bg-cover dark:bg-mauveDark-mauve6"
              />
              <div
                style={{
                  backgroundImage: `url(${mockData.popularPictures[3]})`,
                }}
                className="h-36 w-full bg-mauve-mauve6 bg-cover blur dark:bg-mauveDark-mauve6"
              />
              <div
                style={{
                  backgroundImage: `url(${mockData.popularPictures[2]})`,
                }}
                className="h-36 w-full bg-mauve-mauve6 bg-cover blur dark:bg-mauveDark-mauve6"
              />
              <div
                style={{
                  backgroundImage: `url(${mockData.popularPictures[5]})`,
                }}
                className="h-36 w-full bg-mauve-mauve6 bg-cover blur dark:bg-mauveDark-mauve6"
              />
            </div>
          </div>
          <Separator className="my-16" />
        </div>
      ) : (
        <Welcome />
      )}
    </div>
  )
}

export default Username
