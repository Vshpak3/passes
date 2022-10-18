import { PostDto, TagDto, UserApi } from "@passes/api-client"
import { FC, useEffect, useState } from "react"

type PostTextContentProps = Pick<PostDto, "text" | "tags">

export const PostTextContent: FC<PostTextContentProps> = ({ text, tags }) => {
  const api = new UserApi()

  const [formattedText, setFormattedText] = useState(text)

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

    // Must loop through string in reverse order otherwise the indexes will change
    tags.sort((a, b) => b.index - a.index)
    for (const tag of tags) {
      const username = userIdsToUsernames[tag.userId]
      text =
        text.slice(0, tag.index) +
        `<a href="/${username}" class="text-[rgb(191,122,240)]">@${username}</a>` +
        text.slice(tag.index + 1)
    }

    setFormattedText(text)
  }

  useEffect(() => {
    insertMentions(text, tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, tags])

  return (
    <p
      className="break-all text-start text-base font-medium text-[#ffffff]/90"
      dangerouslySetInnerHTML={{ __html: formattedText }}
    />
  )
}
