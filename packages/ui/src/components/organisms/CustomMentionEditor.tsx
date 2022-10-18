import Editor from "@draft-js-plugins/editor"
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionData,
  Popover
} from "@draft-js-plugins/mention"
import { EntryComponentProps } from "@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry"
import { TagDto } from "@passes/api-client"
import classNames from "classnames"
import {
  CharacterMetadata,
  convertFromRaw,
  EditorState,
  getDefaultKeyBinding
} from "draft-js"
import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { ContentService } from "src/helpers/content"
import { useCreatorSearch } from "src/hooks/useCreatorSearch"
import editorStyles from "src/styles/components/CustomComponentMentionEditor.module.css"

const MENTION_LIMIT = 5

const TRIGGER = "@"

const Entry: FC<EntryComponentProps> = ({
  mention,
  isFocused,
  ...parentProps
}) => (
  <div {...parentProps} className="z-50 flex flex-col py-2 px-4">
    <div
      className={classNames(
        "flex cursor-pointer flex-row items-center gap-2 text-sm font-bold text-[#868487] hover:text-[#9c4dc1]",
        { "text-[#9c4dc1]": isFocused }
      )}
    >
      <img
        src={mention.avatar}
        className="h-8 w-8 rounded-full"
        role="presentation"
        alt=""
      />
      <div>
        <div>{mention.name}</div>
        <div>@{mention.username}</div>
      </div>
    </div>
  </div>
)

interface CustomMentionProps {
  placeholder?: string
  onInputChange: (params: object) => any
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

  const { results, searchValue, setSearchValue } = useCreatorSearch()

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent: ({ mention }) => (
        <a className="text-[rgb(191,122,240)]" href={`/${mention.username}`}>
          @{mention.username}
        </a>
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
        displayName: displayName || "",
        id: userId,
        avatar: ContentService.profileThumbnail(userId)
      })
    )

    setSuggestions(
      defaultSuggestionsFilter(searchValue, newSuggestions, TRIGGER)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const tags: TagDto[] = mentions.map((mention) => ({
        userId: mention.id as string,
        index: mention.index
      }))

      onInputChange({ text, tags })
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
        onChange={onChange}
        plugins={plugins}
        ref={ref}
        placeholder={placeholder}
        keyBindingFn={myKeyBindingFn}
      />
      {numMentions <= MENTION_LIMIT && (
        <MentionSuggestions
          open={areSuggestionsOpen}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
          entryComponent={Entry}
          popoverContainer={({ children, ...props }) => (
            <Popover {...props}>
              <div className="z-50 rounded-md border border-passes-dark-100 bg-black">
                {children}
              </div>
            </Popover>
          )}
        />
      )}
    </div>
  )
}

export default CustomComponentMentionEditor // eslint-disable-line import/no-default-export
