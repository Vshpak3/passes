import * as RadixAvatar from "@radix-ui/react-avatar"
import PropTypes from "prop-types"
import { Text } from "src/components/atoms"

const Avatar = ({
  className = "",
  dragActive = false,
  editing = false,
  src,
  style
}) => (
  <RadixAvatar.Root
    style={style}
    className={
      "relative mx-auto grid h-48 w-48 shrink-0 place-items-center" +
      (className && ` ${className}`)
    }
  >
    <RadixAvatar.Image
      src={src}
      className="h-full w-full overflow-hidden rounded-full border border-mauve-mauve6 object-cover dark:border-mauveDark-mauve6"
      alt=""
    />
    <RadixAvatar.Fallback
      className={`relative grid h-full w-full place-items-center overflow-hidden rounded-full border border-mauve-mauve6 text-mauve-mauve11 transition-colors dark:border-mauveDark-mauve6 dark:text-mauveDark-mauve11 ${
        (editing && "hover:bg-mauve-mauve5 dark:hover:bg-mauveDark-mauve5") +
        (editing && dragActive
          ? " bg-mauve-mauve5 dark:bg-mauveDark-mauve5"
          : "")
      }`}
    >
      {editing ? (
        <>
          <div className="absolute h-px w-10/12 rotate-0 bg-mauve-mauve6 dark:bg-mauveDark-mauve6" />
          <div className="absolute h-px w-10/12 rotate-45 bg-mauve-mauve6 dark:bg-mauveDark-mauve6" />
          <div className="absolute h-px w-10/12 -rotate-45 bg-mauve-mauve6 dark:bg-mauveDark-mauve6" />
          <div className="absolute h-px w-10/12 rotate-90 bg-mauve-mauve6 dark:bg-mauveDark-mauve6" />
          <div className="z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-mauve-mauve1 dark:bg-black">
            <em className="-mt-2 text-xl">Icon</em>
            <Text className="font-medium" fontSize={12}>
              240&thinsp;&times;&thinsp;240
            </Text>
          </div>
        </>
      ) : (
        <>
          <div className="absolute h-full w-full rounded-full bg-mauve-mauve3 dark:bg-mauveDark-mauve2" />
        </>
      )}
    </RadixAvatar.Fallback>
  </RadixAvatar.Root>
)

Avatar.propTypes = {
  className: PropTypes.string,
  dragActive: PropTypes.bool,
  preview: PropTypes.bool,
  src: PropTypes.string,
  style: PropTypes.object
}

export default Avatar
