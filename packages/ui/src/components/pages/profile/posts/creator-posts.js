import PostCard from "./post-card"

const MOCK_POSTS = [
  {
    id: 1,
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    media: {
      url: "/andrea-botez/magician-mock-1.jpg"
    },
    metaData: {
      likes: 328,
      comments: 578,
      sharableUrl: "passes.com/example/url"
    }
  },
  {
    id: 3,
    text: `hi fans checkout my new vid`,
    media: {
      url: "/andrea-botez/magician-mock-2.jpg"
    },
    metaData: {
      likes: 123,
      comments: 78,
      sharableUrl: "passes.com/example/url"
    }
  }
]
const CreatorPosts = (props) => {
  const { creator } = props
  return (
    <div className="w-100 min-h-full">
      {MOCK_POSTS.map((post) => {
        return <PostCard creator={creator} post={post} key={post.id} />
      })}
    </div>
  )
}

export default CreatorPosts
