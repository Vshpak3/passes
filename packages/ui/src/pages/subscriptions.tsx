import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Avatar } from 'src/components/avatar'
import { Separator } from 'src/components/separator'
import { Wordmark } from 'src/components/wordmark'
import { Welcome } from 'src/containers/welcome'
import { Gear } from 'src/icons/gear'

const ProfilePage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (session === null) {
    void router.push('/', '/', { shallow: true })
  }

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
            {/* <button
              className="grid h-8 w-8 place-items-center"
              onClick={signOut}
            >
              <Exit width={20} height={20} />
            </button> */}
          </div>
        </div>
        <Separator />
      </header>
      <Welcome />
    </div>
  )
}

export default ProfilePage
