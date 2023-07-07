'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Database } from '@/types/supabase';

type Comment = Database['public']['Tables']['comments']['Row'];
type User = Database['public']['Tables']['users']['Row'];
type CommentSectionProps = {
  userId: string;
  screenId: string;
};

export function CommentSection({ userId, screenId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getInitialComments = async () => {
      const { data } = await supabase.from('comments').select();
      if (data) {
        setComments(data);
      }
    };

    const getInitialUsers = async () => {
      const { data } = await supabase.from('users').select();
      if (data) {
        setUsers(data);
      }
    };

    Promise.all([getInitialComments(), getInitialUsers()]);
  }, [supabase]);

  useEffect(() => {
    const handleCommentInsert = (payload: { new: Comment }) => {
      setComments((comments) => [...comments, payload.new]);
    };

    const channel = supabase
      .channel('realtime:comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        handleCommentInsert
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, setComments, comments]);

  const [loading, setLoading] = useState<boolean>(false);

  const formSchema = z.object({
    comment: z.string().min(1, 'Comment is required'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { error } = await supabase.from('comments').insert({
        comment: values.comment,
        user_id: userId,
        screen_id: screenId,
      });

      if (error) {
        throw new Error(error.message);
      }

      form.reset();
      setLoading(false);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  const getCommentUserEmail = (userId: string): string => {
    const user = users?.find((user) => user.id === userId);
    if (user) {
      return user.email;
    }

    return '';
  };

  return (
    <section className="rounded-md border p-4">
      <h2 className="text-lg font-semibold">Comments</h2>
      <ul className="my-4 flex list-disc flex-col gap-2">
        {comments?.map((comment) => (
          <li key={comment.id} className="flex items-center space-x-2">
            <Badge variant="outline">{getCommentUserEmail(comment.user_id)}</Badge>
            <span className="text-sm">{comment.comment}</span>
          </li>
        ))}
      </ul>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Comments</FormLabel> */}
                <FormControl>
                  <Textarea className="flex-1" placeholder="Ask a question here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full justify-end">
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </Button>
            ) : (
              <Button type="submit" size="sm">
                Add comment
              </Button>
            )}
          </div>
        </form>
      </Form>
    </section>
  );
}
