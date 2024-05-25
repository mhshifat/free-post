"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { insertPostSchema } from "@/db/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import useNewPostMutation from "../apis/use-new-post-mutation";
import { useRouter } from "next/navigation";

const formSchema = insertPostSchema.omit({ id: true, userId: true });
type FormSchema = z.infer<typeof formSchema>;

export default function NewPostForm() {
  const { push } = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });
  const mutation = useNewPostMutation();

  const isLoading = mutation.isPending;
  const isDisabled = isLoading;

  function handleSubmit(values: FormSchema) {
    mutation.mutate(values, {
      onSuccess: () => push("/posts")
    })
  }
  return (
    <Form {...form}>
      <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="thumbnail"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="summary"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-5">
          <Button type="submit" disabled={isDisabled}>
            {isLoading ? "Loading..." : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  )
}