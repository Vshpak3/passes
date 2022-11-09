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
    <div className="grid w-full grid-cols-7">
      <div className="col-span-7 w-full pt-20 lg:col-span-4">
        <Post post={post} postByUrl />
      </div>
      <div className="col-span-3 hidden h-screen border-l-[0.5px] border-[#3A444C]/[0.64] lg:block" />
    </div>
  </>
)
