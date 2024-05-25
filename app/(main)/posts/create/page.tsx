import NewPostForm from "@/components/modules/posts/components/new-post-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePostPage() {
  return (
    <div className="container">
      <Card>
        <CardHeader>
          <CardTitle>Create a new post</CardTitle>
          <CardDescription>Please fill in the required(*) fields below to create a new post</CardDescription>
        </CardHeader>
        <CardContent>
          <NewPostForm />
        </CardContent>
      </Card>
    </div>
  )
}