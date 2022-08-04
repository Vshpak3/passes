import NextLink from "next/link"
import { Text } from "src/components/atoms"
import { Avatar } from "src/components/molecules"

const Welcome = () => {
  return (
    <div className="big-container pt-[54px] xl:pt-[unset]">
      <div className="flex w-full flex-col items-center gap-6 pt-12">
        <Text
          style={{ lineHeight: 1 }}
          className="fade-in-bottom font-bold"
          tag="h1"
          fontSize={36}
        >
          Welcome to Moment
        </Text>
        <Text
          style={{ "--stagger": 1 }}
          className="fade-in-bottom max-w-prose font-medium text-mauve-mauve11 dark:text-mauveDark-mauve11"
          fontSize={18}
        >
          We created this space to celebrate creators and allow more freedom to
          interact and engage with you, the fan. Explore our most popular
          creators below.
        </Text>
        <div
          style={{ "--stagger": 2 }}
          className="fade-in-bottom mt-4 flex flex-wrap items-center justify-center gap-4 [mask-image:linear-gradient(to_bottom,_white,_white,_transparent)] [-webkit-mask-image:linear-gradient(to_bottom,_white,_white,_transparent)] md:mt-8"
        >
          <NextLink href="/creator/andreabotez" as="/andreabotez">
            <a aria-label="@andreabotez">
              <Avatar
                className="!mx-0 !h-24 !w-24"
                src="/andrea-botez/avatar.jpeg"
              />
            </a>
          </NextLink>
          {[...Array(96)].map((_, index) => (
            <Avatar className="!mx-0 !h-24 !w-24" key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Welcome
