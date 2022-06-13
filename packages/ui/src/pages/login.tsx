import NextHead from 'next/head'
import { useRouter } from 'next/router'
import type { AppProviders } from 'next-auth/providers'
import { getProviders, signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Button } from 'src/components/button'
import { Separator } from 'src/components/separator'
import { Text } from 'src/components/text'
import { Wordmark } from 'src/components/wordmark'
import { Arrow } from 'src/icons/arrow'
import { Social } from 'src/icons/social'

const LoginPage = ({ providers }: { providers: AppProviders }) => {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      void router.push('/subscriptions')
    }
  }, [router, session])

  return (
    <>
      <NextHead>
        <link // hotfix for web font optimization issue: https://github.com/vercel/next.js/issues/35835#issuecomment-1125599724
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=Playfair+Display:ital,wght@1,400..800&display=swap"
          rel="stylesheet"
        />
      </NextHead>
      <div className="relative h-full w-full">
        <div className="absolute hidden h-full w-full bg-gradient-to-t from-transparent via-transparent to-plum-plum2 dark:hidden dark:to-plumDark-plum1 sm:block" />
        <div className="absolute hidden h-full w-full bg-gradient-to-b from-transparent via-transparent to-purple-purple4 dark:to-purpleDark-purple1 sm:block" />
        <div className="absolute hidden h-full w-full bg-gradient-to-r from-transparent to-pink-pink2 dark:hidden dark:to-pinkDark-pink1 sm:block" />
        <div className="absolute hidden h-full w-full bg-gradient-to-l from-transparent to-crimson-crimson2 dark:hidden dark:to-crimsonDark-crimson1 sm:block" />
        <div className="fade-in-bottom container flex justify-center pt-10">
          <Wordmark height={18} width={93} />
        </div>
        <div
          style={{ '--stagger': 1 } as any}
          className="fade-in-bottom container flex flex-col items-center gap-6 pb-8"
        >
          <Separator className="mt-8 mb-4" />
          {Object.values(providers).map((provider) => (
            <Button
              onClick={() => void signIn(provider.id)}
              className={
                (provider.name === 'Discord'
                  ? 'bg-[#5865F2] shadow-[#5865F2]/30 hover:bg-[#5865F2]/90'
                  : provider.name === 'Google'
                  ? 'bg-[#DB4437] shadow-[#DB4437]/30 hover:bg-[#DB4437]/90'
                  : provider.name === 'Instagram'
                  ? 'bg-[#C13584] shadow-[#C13584]/30 hover:bg-[#C13584]/90'
                  : provider.name === 'Twitch'
                  ? 'bg-[#9146FF] shadow-[#9146FF]/30 hover:bg-[#9146FF]/90'
                  : '') +
                ' w-full max-w-sm !px-5 !py-4 text-white shadow-md transition-all hover:shadow-sm'
              }
              innerClassName="w-full justify-between font-medium"
              fontSize={16}
              key={provider.name}
            >
              <Social variant={provider.name} width={16} height={16} />{' '}
              <span>Login with {provider.name}</span>
              <span />
            </Button>
          ))}
        </div>
        <div
          style={{ '--stagger': 2 } as any}
          className="fade-in-bottom container pb-16"
        >
          <div className="relative mt-4 mb-10 flex w-full items-center justify-center">
            <div className="absolute left-0 w-[calc(50%-1.5rem)]">
              <Separator />
            </div>
            <div className="absolute right-0 w-[calc(50%-1.5rem)]">
              <Separator />
            </div>
            <div className="w-fit">
              <Text className="font-medium text-mauve-mauve12 dark:text-mauveDark-mauve12">
                OR
              </Text>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8">
            <Button
              className="w-full max-w-sm cursor-not-allowed border border-mauve-mauve12 !px-5 !py-4 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white dark:border-mauveDark-mauve11 dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
              fontSize={16}
            >
              Connect Wallet
            </Button>
            <Button
              className="cursor-not-allowed"
              variant="link-blue"
              fontSize={16}
              innerClassName="!space-x-1"
            >
              <span>Continue with Email</span>{' '}
              <Arrow variant="right" width={16} height={16} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: { providers },
  }
}

export default LoginPage
