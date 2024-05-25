import { honoClient } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

export default function useGetPostsQuery() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await honoClient.api.posts.$get();
      if (!response.ok) throw new Error("Failed to fetch posts!");
      const { data } = await response.json();
      return data;
    },
  })
}