import { PostDto, TagDto, UserApi } from "@passes/api-client"
import { FC, useEffect, useState } from "react"
import { formatReplacedText } from "src/helpers/formatters"
type PostTextContentProps = Pick<PostDto, "text" | "tags">

export const PostTextContent: FC<PostTextContentProps> = ({ text, tags }) => {
  const api = new UserApi()

  const [formattedText, setFormattedText] = useState<
    JSX.Element | string | null
  >(text)

  const insertMentions = async (text: string, tags: TagDto[]) => {
    const userIdsToUsernames = Object.fromEntries(
      await Promise.all(
        tags.map(
          async (t) =>
            await api
              .getUsernameFromId({ userId: t.userId })
              .then((name) => [t.userId, name])
        )
      )
    )

    const tagMap: Record<number, string> = {}
    tags.forEach((tag) => {
      const username = userIdsToUsernames[tag.userId]
      tagMap[
        tag.index
      ] = `<a href="/${username}" class="text-[rgb(191,122,240)]">@${username}</a>`
    })

    setFormattedText(formatReplacedText(text, tagMap))
  }

  useEffect(() => {
    insertMentions(text, tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, tags])

  return (
    <p className="break-all text-start text-base font-medium text-[#ffffff]/90">
      {formattedText}
    </p>
  )
}
