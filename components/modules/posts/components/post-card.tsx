import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { honoClient } from "@/lib/hono";
import { InferResponseType } from "hono";
import Image from "next/image";

type ResponseType = InferResponseType<typeof honoClient.api.posts.$get, 200>;
type Post = ResponseType["data"][0];

export default function PostCard({ post }: { post: Post }) {
  return (
    <Card>
      <CardHeader className="relative w-full aspect-square overflow-hidden">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
        />
      </CardHeader>
      <CardContent className="pt-5">
        <CardTitle className="flex items-center justify-between gap-5">
          {post.title}

          <Badge className="uppercase">{post.type}</Badge>
        </CardTitle>
        <CardDescription>{post.title}</CardDescription>
      </CardContent>
    </Card>
  )
}