import CreatorContentFeed from "src/components/pages/profile/main-content/news-feed/creator-content-feed"
import { useFeed } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"
// import { useSWRConfig } from "swr"
// import { wrapApi } from "../helpers"
// import { PostApi } from "@passes/api-client"
// import { NewPost } from "../components/pages/profile/main-content/new-post"
// import InfoIcon from "public/icons/post-info-circle-icon.svg"
// import { useState } from "react"
// import { useRouter } from "next/router"
// import VerifiedSmall from "public/icons/post-verified-small-icon.svg"

const profile = {
  profileImageUrl: "https://www.w3schools.com/w3images/avatar2.png",
  fullName: "Test User",
  userId: "testUser",
  passes: []
}
const Home = () => {
  // const router = useRouter()
  // const { mutate } = useSWRConfig()
  // const { user } = useUser()
  // const [expiredSubscriptions, setExpiredSubscriptions] = useState([
  //   {
  //     id: 1,
  //     name: "Keya",
  //     expiredAt: "Aug 28, 2022",
  //     dismiss: false,
  //     resubscribe: false,
  //     username: "zoya733"
  //   },
  //   {
  //     id: 2,
  //     name: "Jake",
  //     expiredAt: "March 12, 2021",
  //     dismiss: false,
  //     resubscribe: false,
  //     username: "zoya733"
  //   },
  //   {
  //     id: 3,
  //     name: "Alina",
  //     expiredAt: "March 12, 2021",
  //     dismiss: false,
  //     resubscribe: false,
  //     username: "zoya733"
  //   },
  //   {
  //     id: 4,
  //     name: "Mark",
  //     expiredAt: "Aug 28, 2022",
  //     dismiss: false,
  //     resubscribe: false,
  //     username: "zoya733"
  //   },
  //   {
  //     id: 5,
  //     name: "Lucy",
  //     expiredAt: "March 12, 2021",
  //     dismiss: false,
  //     resubscribe: false,
  //     username: "zoya733"
  //   },
  //   {
  //     id: 6,
  //     name: "Zoya",
  //     expiredAt: "March 12, 2021",
  //     dismiss: false,
  //     resubscribe: false,
  //     username: "zoya733"
  //   }
  // ])

  // const onDismissSubscription = (id) => {
  //   let newSubscriptions = expiredSubscriptions.filter(
  //     (subscription) => subscription.id !== id
  //   )
  //   setExpiredSubscriptions(newSubscriptions)
  // }
  // const onResubscribe = (id) => {
  //   let newSubscriptions = expiredSubscriptions.filter(
  //     (subscription) => subscription.id !== id
  //   )
  //   setExpiredSubscriptions(newSubscriptions)
  // }
  // const createPost = async (values) => {
  //   const api = wrapApi(PostApi)
  //   mutate(
  //     [`/post/creator/`, user.username],
  //     async () =>
  //       await api.postCreate({
  //         createPostRequestDto: {
  //           passes: [],
  //           content: values.content,
  //           text: values.text,
  //           _private: true,
  //           expiresAt: 0
  //         }
  //       }),
  //     {
  //       populateCache: (post, previousPosts) => {
  //         if (!previousPosts)
  //           return {
  //             count: 1,
  //             cursor: user.username,
  //             posts: [post]
  //           }
  //         else
  //           return {
  //             count: previousPosts.count + 1,
  //             cursor: previousPosts.cursor,
  //             posts: [post, ...previousPosts.posts]
  //           }
  //       },
  //       // Since the API already gives us the updated information,
  //       // we don't need to revalidate here.
  //       revalidate: false
  //     }
  //   )
  // }
  const { posts = [] } = useFeed()
  return (
    <>
      {posts?.length > 0 ? (
        <div className="w-full bg-black">
          <div className="mx-auto grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:-mt-56 md:w-[653px] md:pt-20  lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
            <div className="col-span-10 w-full space-y-6 lg:col-span-7 lg:max-w-[680px]">
              {/* <NewPost
            passes={profile?.passes}
            createPost={createPost}
            placeholder="What’s on your mind?"
          /> */}
              {/* TODO: this will come on part 2 */}

              {/* <div className="w-full border-b border-passes-dark-100 pt-4"></div>
          {expiredSubscriptions.length > 0 && (
            <ExpiredSubscriptions
              expiredSubscriptions={expiredSubscriptions}
              onResubscribe={onResubscribe}
              onDismissSubscription={onDismissSubscription}
              router={router}
            />
          )} */}
              {/* TODO: this will come on part 2 */}

              <CreatorContentFeed
                profile={profile}
                existingPosts={posts[0]?.posts}
              />
            </div>
            {/* <div className="col-span-10 w-full space-y-6 lg:col-span-3 lg:max-w-[680px]">
          <span className="text-[24px] leading-[25px] text-white font-bold">
            Suggestions
          </span>
          <div className="flex flex-col gap-4"></div>
        </div> */}
            {/* TODO: this will come on part 2 */}
          </div>
        </div>
      ) : (
        <div>Follow Creators to receive posts..</div>
      )}
    </>
  )
}

export default withPageLayout(Home)
{
  /* TODO: this will come on part 2 */
}

// export const ExpiredSubscriptions = ({
//   expiredSubscriptions,
//   onResubscribe,
//   onDismissSubscription,
//   router
// }) => (
//   <div className="flex flex-col gap-3 w-full overflow-auto max-h-[130px]">
//     {expiredSubscriptions &&
//       expiredSubscriptions.map((subscription, index) => (
//         <div
//           key={index}
//           className="flex items-center justify-start w-full gap-[10px] border border-passes-dark-100 p-[10px] bg-gradient-to-r from-[#bf7af0]/40 via-transparent to-transparent rounded-md"
//         >
//           <span>
//             <InfoIcon />
//           </span>
//           <span className="flex gap-1 text-[16px] leading-[24px] font-medium">
//             <span>Your subscription to</span>{" "}
//             <span
//               onClick={() => router.push(`/${subscription.username}`)}
//               className="text-[#BF7AF0] hover:underline cursor-pointer"
//             >
//               {subscription.name}
//             </span>{" "}
//             <span>has expired on</span>
//             <span>{subscription.expiredAt}</span>
//           </span>
//           <button
//             onClick={() => onResubscribe(subscription.id)}
//             className="text-[#BF7AF0] text-[16px]  leading-[25px] font-bold hover:underline"
//           >
//             Re subscribe
//           </button>
//           <button
//             onClick={() => onDismissSubscription(subscription.id)}
//             className="text-[#FFFF]/90 text-[16px] opacity-50 leading-[25px] font-bold hover:text-[#FFFF] hover:opacity-70"
//           >
//             Dismiss
//           </button>
//         </div>
//       ))}
//   </div>
// )
{
  /* TODO: this will come on part 2 */
}

// export const SuggestedCreator = () => (
//   <div className="flex items-center space-x-4">
//     <img // eslint-disable-line @next/next/no-img-element
//       className="h-12 w-12 rounded-full object-cover"
//       src="/img/investors/kevin.jpg"
//       alt="kevin"
//     />
//     <div className="space-y-1 font-medium dark:text-white">
//       <div className="flex items-center gap-[6px]">
//         <span className="whitespace-nowrap font-semibold md:text-[20px] md:leading-[25px]">
//           Kevin Rosen
//         </span>
//         <span className="flex items-center">
//           <VerifiedSmall />
//         </span>
//       </div>
//       <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-sm font-normal leading-[14px] text-transparent">
//         @kevin
//       </span>
//     </div>
//   </div>
// )
