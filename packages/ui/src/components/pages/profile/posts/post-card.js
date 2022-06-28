const PostCard = (props) => {
  const { creator, post } = props

  return (
    <div className="mt-4 mb-5 flex max-w-4xl flex-col text-white">
      <div className="mb-3">
        <img
          src={creator.avatarUrl}
          className="mr-3 inline-block h-12 w-12 rounded-full"
        />
        <p className="inline-block font-bold">
          {creator.name}{" "}
          <span className="font-normal">@{creator.username}</span>
        </p>
      </div>
      <p className="mb-3 max-w-2xl">{post.text}</p>
      <div>
        <img src={post.media.url} />
      </div>
      <div className="my-8 flex flex-row space-x-32 px-10">
        <div className="flex flex-row">
          <div className="mr-12 flex flex-col">
            <img src="/icons/heart.svg" className="mb-1 h-6" />
            {post.metaData.likes}
          </div>
          <div className="mr-12 flex flex-col">
            <img src="/icons/comments.svg" className="min-h-6 mb-1" />
            {post.metaData.comments}
          </div>
          <div className="mr-12 flex flex-col">
            <img src="/icons/share.svg" className="mb-1 h-6" />
            share
          </div>
        </div>
        <div className="flex flex-row">
          <img src="/icons/piggybank.svg" className="min-h-6 mb-1 mr-3" />
          <button className="btn btn-active bg-gray-500">
            Show Anna some love
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
