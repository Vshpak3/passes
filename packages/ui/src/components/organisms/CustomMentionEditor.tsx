import Editor from "@draft-js-plugins/editor"
import createMentionPlugin, {
  MentionData,
  Popover
} from "@draft-js-plugins/mention"
import { EntryComponentProps } from "@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry"
import { TagDto } from "@passes/api-client"
import {
  CharacterMetadata,
  convertFromRaw,
  EditorState,
  getDefaultKeyBinding
} from "draft-js"
import Link from "next/link"
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"

import { UserSearchResult } from "src/components/atoms/search/user/UserSearchResults"
import { ContentService } from "src/helpers/content"
import { useCreatorSearch } from "src/hooks/search/useCreatorSearch"
import editorStyles from "src/styles/components/CustomComponentMentionEditor.module.css"
import { NewPostTextFormProps } from "./profile/main-content/new-post/NewPostEditor"

const MENTION_LIMIT = 5

const TRIGGER = "@"

const Entry: FC<EntryComponentProps & { disabled: boolean }> = ({
  mention,
  isFocused,
  disabled,
  ...parentProps
}) => {
  // TODO: handle selectMention from parentProps dom error
  return (
    <div {...parentProps}>
      <UserSearchResult
        active={isFocused}
        disabled={disabled}
        displayName={mention.displayName}
        userId={mention.id as string}
        username={mention.username}
      />
    </div>
  )
}

interface CustomMentionProps {
  placeholder?: string
  onInputChange: (params: NewPostTextFormProps) => void
  isReset?: boolean
  setIsReset?: (value: boolean) => void
  defaultText?: string
}

const emptyContentState = (text: string) =>
  convertFromRaw({
    entityMap: {},
    blocks: [
      {
        text,
        key: "postContent",
        type: "unstyled",
        entityRanges: [],
        depth: 0,
        inlineStyleRanges: []
      }
    ]
  })

const CustomComponentMentionEditor: FC<CustomMentionProps> = ({
  placeholder,
  onInputChange,
  isReset,
  setIsReset,
  defaultText = ""
}): ReactElement => {
  const ref = useRef<Editor>(null)
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(emptyContentState(defaultText))
  )

  const [areSuggestionsOpen, setAreSuggestionsOpen] = useState(false)
  const [numMentions, setNumMentions] = useState(0)
  const [suggestions, setSuggestions] = useState<MentionData[]>([])

  const { results, setSearchValue } = useCreatorSearch()

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent: ({ mention }) => (
        <Link className="text-[rgb(191,122,240)]" href={`/${mention.username}`}>
          @{mention.username}
        </Link>
      ),
      mentionPrefix: TRIGGER
    })

    const { MentionSuggestions } = mentionPlugin
    const plugins = [mentionPlugin]

    return { plugins, MentionSuggestions }
  }, [])

  const onOpenChange = useCallback((_open: boolean) => {
    setAreSuggestionsOpen(_open)
  }, [])

  const onSearchChange = useCallback(
    async ({ value }: { trigger: string; value: string }) => {
      setSearchValue(value)
    },
    [setSearchValue]
  )

  useEffect(() => {
    const newSuggestions: MentionData[] = results.map(
      ({ displayName, username, userId }) => ({
        name: username,
        username,
        displayName,
        id: userId,
        avatar: ContentService.profileThumbnailPath(userId)
      })
    )

    setSuggestions(newSuggestions)
  }, [results])

  useEffect(() => {
    if (isReset && setIsReset) {
      setEditorState(EditorState.createEmpty())
      setIsReset(false)
    }
  }, [isReset, setIsReset])

  /** Catch ctrl + enter so it doesn't produce a trailing newline */
  const myKeyBindingFn = useCallback((e: React.KeyboardEvent<Element>) => {
    if (e.ctrlKey && e.key === "Enter") {
      return
    }

    return getDefaultKeyBinding(e)
  }, [])

  const onChange = useCallback(
    (value: EditorState) => {
      setEditorState(value)
      const currentContent = value.getCurrentContent()
      const block = currentContent.getBlocksAsArray()[0]

      const mentions: MentionData[] = []

      // Find start indices for each mentioned user
      const filter = (character: CharacterMetadata) => {
        const entityKey = character.getEntity()

        if (entityKey) {
          const entity = currentContent.getEntity(entityKey)

          if (entity.getType() === "mention") {
            mentions.push(entity.getData().mention as MentionData)

            return true
          }
        }

        return false
      }
      const callback = (index: number) => {
        mentions[mentions.length - 1] = {
          ...mentions[mentions.length - 1],
          index
        }
      }
      block.findEntityRanges(filter, callback)

      setNumMentions(mentions.length)

      const text = currentContent.getPlainText()
      const tags: TagDto[] = []
      const mentionsMap: Record<number, MentionData> = {}
      mentions.forEach((mention) => {
        mentionsMap[mention.index] = mention
      })
      let formattedText = ""
      for (let i = 0; i < text.length; ++i) {
        formattedText = formattedText.concat(text[i])
        if (mentionsMap[i]) {
          tags.push({
            userId: mentionsMap[i].id as string,
            index: formattedText.length - 1
          })
          i += mentionsMap[i].username.length
        }
      }
      onInputChange({ text: formattedText, tags })
    },
    [onInputChange]
  )

  return (
    <div
      className={editorStyles.editor}
      onClick={() => {
        ref.current?.focus()
      }}
    >
      <Editor
        editorKey="editor"
        editorState={editorState}
        keyBindingFn={myKeyBindingFn}
        onChange={onChange}
        placeholder={placeholder}
        plugins={plugins}
        ref={ref}
      />
      <MentionSuggestions
        entryComponent={(props) => (
          <Entry {...props} disabled={numMentions >= MENTION_LIMIT} />
        )}
        onOpenChange={onOpenChange}
        onSearchChange={onSearchChange}
        open={areSuggestionsOpen}
        popoverContainer={({ children, ...props }) => (
          <Popover {...props}>
            <div className="z-50 border border-passes-dark-100 bg-black">
              {children}
            </div>
          </Popover>
        )}
        suggestions={suggestions}
      />
    </div>
  )
}

export default CustomComponentMentionEditor // eslint-disable-line import/no-default-export
