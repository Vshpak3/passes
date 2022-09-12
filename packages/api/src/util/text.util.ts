import { TagDto } from './dto/tag.dto'
import { TagError } from './error.ts/tag.error'

export const verifyTaggedText = (text: string, tags: TagDto[]) => {
  const indices = new Set(tags.map((tag) => tag.index))
  if (indices.size !== tags.length) {
    throw new TagError('repeat indices')
  }
  tags.forEach((tag) => {
    if (text.charAt(tag.index) !== '@') {
      throw new TagError('incorrect format: character at index must be a @')
    }
  })
}
