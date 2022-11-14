import { TagDto } from "@passes/api-client"
import { FC, useEffect, useState } from "react"

import { useGlobalCache } from "src/contexts/GlobalCache"
import { formatReplacedText } from "src/helpers/formatters"
import { rejectIfAny } from "src/helpers/promise"
import { getUsername } from "src/helpers/username"

type FormattedTextProps = {
  tags: TagDto[]
  text: string
}

export const FormattedText: FC<FormattedTextProps> = ({ text, tags }) => {
  const [formattedText, setFormattedText] = useState<
    JSX.Element | string | null
  >(text)
  const context = useGlobalCache()

  const insertMentions = async (text: string, tags: TagDto[]) => {
    const tagMap: Record<number, string> = {}
    rejectIfAny(
      await Promise.allSettled(
        tags.map(async (tag) => {
          const username =
            context.usernames[tag.userId] ??
            (context.usernames[tag.userId] = await getUsername(tag.userId))
          tagMap[
            tag.index
          ] = `<a href="/${username}" class="text-[#FF51A8]">@${username}</a>`
        })
      )
    )

    setFormattedText(formatReplacedText(text, tagMap))
  }

  useEffect(() => {
    insertMentions(text, tags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, tags])

  return <>{formattedText}</>
}
