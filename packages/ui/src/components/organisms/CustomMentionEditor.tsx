import Editor from "@draft-js-plugins/editor"
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionData,
  Popover
} from "@draft-js-plugins/mention"
import { EntryComponentProps } from "@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry"
import classNames from "classnames"
import {
  convertFromRaw,
  convertToRaw,
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
import editorStyles from "src/styles/components/CustomComponentMentionEditor.module.css"

const MENTION_LIMIT = 5

// TODO: make mentions real!
const mentions: MentionData[] = [
  {
    name: "Alex Drachnik",
    username: "drachnik",
    avatar:
      "https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg"
  },
  {
    name: "First Fan",
    username: "limani",
    avatar: "https://avatars0.githubusercontent.com/u/2182307?v=3&s=400"
  },
  {
    name: "Second Fan",
    username: "secondFan",
    avatar: "https://avatars0.githubusercontent.com/u/2182307?v=3&s=400"
  }
]

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
        key: "foo",
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

  const [open, setOpen] = useState(false)
  const [mentionLimit, setMentionLimit] = useState(0)
  const [suggestions, setSuggestions] = useState(mentions)

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      mentionComponent(mentionProps) {
        return (
          <span
            className="text-[#4a85bb]"
            onClick={() => alert("Clicked on the Mention!")}
          >
            @{mentionProps.children}
          </span>
        )
      }
    })
    const { MentionSuggestions } = mentionPlugin
    const plugins = [mentionPlugin]
    return { plugins, MentionSuggestions }
  }, [])

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open)
  }, [])
  const onSearchChange = useCallback(
    ({ trigger, value }: { trigger: string; value: string }) => {
      setSuggestions(defaultSuggestionsFilter(value, mentions, trigger))
    },
    []
  )

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

  return (
    <div
      className={editorStyles.editor}
      onClick={() => {
        ref.current?.focus()
      }}
    >
      <Editor
        editorKey={"editor"}
        editorState={editorState}
        onChange={(value) => {
          const plainTextValue = value.getCurrentContent().getPlainText()
          setEditorState(value)
          const raw = convertToRaw(value.getCurrentContent()).entityMap
          const mentionedUsers = Object.values(raw).map(
            (entity) => entity.data?.mention?.username
          )
          setMentionLimit(mentionedUsers?.length)
          onInputChange({ text: plainTextValue, mentions: mentionedUsers })
        }}
        plugins={plugins}
        ref={ref}
        placeholder={placeholder}
        keyBindingFn={myKeyBindingFn}
      />
      {mentionLimit <= MENTION_LIMIT && (
        <MentionSuggestions
          open={open}
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
