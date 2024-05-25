export default function PostsPage({ params }: { params: { postId: string } }) {
  return (
    <div>
      Single Post - {params.postId}
    </div>
  )
}