"use client";

import { Loader2 } from "lucide-react";
import useGetPostsQuery from "../apis/use-get-posts-query";
import Link from "next/link";
import PostCard from "./post-card";

export default function PostList({ isPro }: { isPro: boolean }) {
  const { data: posts, isLoading } = useGetPostsQuery();
  
  if (isLoading) return (
    <div className="h-screen w-full flex items-center justify-center fixed inset-0 z-50">
      <Loader2 className="animate-spin size-4 text-slate-500" />
    </div>
  )
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
      {posts?.map(post => (
        <Link href={post?.type === "paid" && !isPro ? "/billing" :`/posts/${post.id}`} key={post.id}>
          <PostCard post={post} />
        </Link>
      ))}
    </div>
  )
}