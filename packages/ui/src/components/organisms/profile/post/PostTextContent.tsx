import { PostDto, TagDto } from "@passes/api-client"
import { FC } from "react"

type PostTextContentProps = Pick<PostDto, "text" | "tags">

const insertMentions = (text: string, tags: TagDto[]) => {
  let formattedText = text

  const matcher = (match: string) => {
    const prefixedUsername = match.trim()
    const username = prefixedUsername.slice(1)

    return ` <a href="/${username}" class="text-[rgb(191,122,240)]">${prefixedUsername}</a> `
  }
  tags.forEach(() => {
    formattedText = formattedText.replace(/\s@\w*\s/, matcher)
  })

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
