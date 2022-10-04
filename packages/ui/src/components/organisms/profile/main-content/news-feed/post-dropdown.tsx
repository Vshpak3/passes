// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Menu, Transition } from "@headlessui/react"
import { PostDto } from "@passes/api-client"
import copy from "copy-to-clipboard"
import ms from "ms"
import PostOptionsIcon from "public/icons/post-options-icon.svg"
import { Fragment } from "react"
import { toast } from "react-toastify"

const AUTO_CLOSE = ms("3 seconds")

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

export const copyToClipboard = (post: PostDto): boolean => {
  copy(window.location.origin + "/" + post.username + "/" + post.postId)

  toast("Link to post has been copied to clipboard!", {
    position: "bottom-left",
    autoClose: AUTO_CLOSE,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  })
}

export const PostDropdown = ({ post, items = [] }: any) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="">
          <PostOptionsIcon className="cursor-pointer stroke-[#868487] hover:stroke-white" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md border border-passes-dark-100 bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item onClick={() => copyToClipboard(post)}>
              {({ active }) => (
                <span
                  className={classNames(
                    active ? "text-passes-primary-color" : "text-[#868487]",
                    "block cursor-pointer px-4 py-2 text-sm"
                  )}
                >
                  Copy link to post
                </span>
              )}
            </Menu.Item>
            {items.map((item: any, index: any) => (
              <Menu.Item key={index} onClick={item.onClick}>
                {({ active }) => (
                  <span
                    className={classNames(
                      active ? "text-passes-primary-color" : "text-[#868487]",
                      "block cursor-pointer px-4 py-2 text-sm"
                    )}
                  >
                    {item.text}
                  </span>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
