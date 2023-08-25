import PostFeed from "@/components/posts/PostFeed"
import Header from "@/components/common/Header"
import Form from "@/components/common/Form"

export default function Home() {
  return (
    <>
      <Header label="Home" />
      <Form placeholder="What's happening?" />
      <PostFeed />
    </>
  )
}
