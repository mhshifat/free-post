import { honoClient } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof honoClient.api.posts[":id"]["$delete"]>;

export default function useDeletePostMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await honoClient.api.posts[":id"].$delete({ param: { id } });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to delete the post!");
      }
    },
    onSuccess: () => {
      toast.success("Post deleted!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Failed to delete the post!");
    },
  })
}