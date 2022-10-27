import { GetPostResponseDto } from "@passes/api-client"
import dynamic from "next/dynamic"
import { FC } from "react"

import { Header } from "src/components/molecules/performance/Header"

const Post = dynamic(
  () => import("src/components/organisms/profile/post/Post"),
  { ssr: false }
)

interface PostByUrlProps {
  post: GetPostResponseDto
}

export const PostByUrl: FC<PostByUrlProps> = ({ post }) => (
  <>
    <Header />
    <div className="w-full bg-black">
      <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 pt-6 sm:w-[653px] md:w-[653px] md:pt-20 lg:w-[900px] lg:w-[1000px] lg:px-0">
        <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
          <Post post={post} postByUrl={true} />
        </div>
      </div>
    </div>
  </>
)
