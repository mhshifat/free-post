import PostList from "@/components/modules/posts/components/posts-list";
import { currentUser } from "@clerk/nextjs/server";

export default async function PostsPage() {
  const user = await currentUser();
  const isPro = user?.privateMetadata?.subscribeTo === "paid";

  return (
    <div>
      <PostList isPro={isPro} />
    </div>
  )
}