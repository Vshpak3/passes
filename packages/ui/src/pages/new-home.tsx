import dynamic from "next/dynamic"

const Home = dynamic(() => import("src/components/pages/HomePage"), {
  ssr: false
})

export default Home
