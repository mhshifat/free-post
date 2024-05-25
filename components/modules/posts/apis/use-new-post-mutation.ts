import { honoClient } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type RequestType = InferRequestType<typeof honoClient.api.posts.$post>["json"];
type ResponseType = InferResponseType<typeof honoClient.api.posts.$post>;

export default function useNewPostMutation() {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await honoClient.api.posts.$post({ json });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to create the post!");
      }
    },
    onSuccess: () => {
      toast.success("Post created!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Failed to create the post!");
    },
  })
}