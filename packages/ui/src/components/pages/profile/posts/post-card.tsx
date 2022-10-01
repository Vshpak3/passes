const PostCard = (props: any) => {
  const { creator, post } = props

  return (
    <div className="mt-4 mb-5 flex max-w-4xl flex-col text-white">
      <div className="mb-3">
        <img // eslint-disable-line @next/next/no-img-element
          src={creator.avatarUrl}
          className="mr-3 inline-block h-12 w-12 rounded-full"
          alt=""
        />
        <p className="inline-block font-bold">
          <span className="font-normal">@{creator.username}</span>
        </p>
      </div>
      <p className="mb-3 max-w-2xl">{post.text}</p>
      <div>
        <img // eslint-disable-line @next/next/no-img-element
          src={post.media.url}
          alt=""
        />
      </div>
      <div className="my-8 flex flex-row space-x-32 px-10">
        <div className="flex flex-row">
          <div className="mr-12 flex flex-col">
            <img // eslint-disable-line @next/next/no-img-element
              src="/icons/heart.svg"
              className="mb-1 h-6"
              alt=""
            />
            {post.metaData.likes}
          </div>
          <div className="mr-12 flex flex-col">
            <img // eslint-disable-line @next/next/no-img-element
              src="/icons/comments.svg"
              className="min-h-6 mb-1"
              alt=""
            />
            {post.metaData.comments}
          </div>
          <div className="mr-12 flex flex-col">
            <img // eslint-disable-line @next/next/no-img-element
              src="/icons/share.svg"
              className="mb-1 h-6"
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-row">
          <img // eslint-disable-line @next/next/no-img-element
            src="/icons/piggybank.svg"
            className="min-h-6 mb-1 mr-3"
            alt=""
          />
          <button className="btn btn-active bg-gray-500">some love</button>
        </div>
      </div>
    </div>
  )
}

export default PostCard
