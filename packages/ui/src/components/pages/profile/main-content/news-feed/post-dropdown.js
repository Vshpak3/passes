import { Menu, Transition } from "@headlessui/react"
import copy from "copy-to-clipboard"
import ms from "ms"
import PostOptionsIcon from "public/icons/post-options-icon.svg"
import { Fragment } from "react"
import { toast } from "react-toastify"

const AUTO_CLOSE = ms("3 seconds")

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export const PostDropdown = ({ post, items = [] }) => {
  const copyToClipboard = () => {
    let baseRoute = ""
    if (typeof window !== "undefined") baseRoute = window.location.origin
    const linkToCopy = baseRoute + "/" + post.username + "/" + post.postId
    copy(linkToCopy)

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
            <Menu.Item onClick={copyToClipboard}>
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
            {items.map((item, index) => (
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
