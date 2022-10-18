import { PostDto, TagDto } from "@passes/api-client"
import { FC } from "react"

type PostTextContentProps = Pick<PostDto, "text" | "tags">

const insertMentions = (text: string, tags: TagDto[]) => {
  let formattedText = text

  // TODO
  const userIdsToUsernames: Record<string, string> = {}
  tags.forEach((x) => (userIdsToUsernames[x.userId] = x.userId))

  // Must loop through string in reverse order otherwise the indexes will change
  tags.sort((a, b) => b.index - a.index)
  for (const tag of tags) {
    const username = userIdsToUsernames[tag.userId]
    formattedText =
      formattedText.slice(0, tag.index + 1) +
      `<a href="/${username}" class="text-[rgb(191,122,240)]">${username}</a>` +
      formattedText.slice(tag.index + 1)
  }

  return formattedText
}

export const PostTextContent: FC<PostTextContentProps> = ({ text, tags }) => {
  return (
    <div className="flex flex-col items-start">
      <p
        className="break-normal break-all text-start text-base font-medium text-[#ffffff]/90"
        dangerouslySetInnerHTML={{ __html: insertMentions(text, tags) }}
      />
    </div>
  )
}
