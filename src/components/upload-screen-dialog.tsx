'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Database } from '@/types/supabase';

export function UploadScreenDialog() {
  const [svgFile, setSvgFile] = useState<{ name: string; content: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    changes: z.string().min(10, {
      message: 'Changes must have at least 10 characters.',
    }),
    file: z.string().min(2, { message: 'A file is necessary.' }),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 10,
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles[0]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      changes: '',
      file: '',
    },
  });

  const readSvgFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          resolve(event.target.result);
        } else {
          reject(new Error('File content could not be read'));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  const handleFileChange = async (file: File) => {
    if (file) {
      try {
        const svgContent = await readSvgFile(file);
        setSvgFile({ name: file.name, content: svgContent });
        form.setValue('file', svgContent);
      } catch (error) {
        console.error('Error reading SVG file', error);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('latest_screen_versions')
        .select('latest_version')
        .eq('name', values.name)
        .single();

      const newVersion = data && data.latest_version ? data.latest_version + 1 : 1;
      const { error } = await supabase.from('screens').insert({
        name: values.name,
        html_file: values.file,
        version: newVersion,
        changes: values.changes,
        is_svg: true,
      });

      if (error) {
        throw new Error(error.message);
      }

      router.refresh();
      form.reset();
      setSvgFile(undefined);
      setLoading(false);
      setDialogOpen(false);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Upload new screen</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[465px]">
        <DialogHeader>
          <DialogTitle>Upload new screen</DialogTitle>
          <DialogDescription>
            Uploading a screen here will require an SVG, which will not be parsed. For the ideal
            user experience, use the Figma plugin!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My new screen" {...field} />
                  </FormControl>
                  <FormDescription>This is the name of the screen.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="changes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Changes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add new screen with features..." {...field} />
                  </FormControl>
                  <FormDescription>These are the updates for that specific screen.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>SVG File</FormLabel>
                  <FormControl>
                    {svgFile ? (
                      <div>
                        <Badge className="select-none">{svgFile.name}</Badge>
                      </div>
                    ) : (
                      <div
                        {...getRootProps({
                          className:
                            'bg-background/90 border rounded-md border-dashed dark:border-gray-700 border-gray-300 h-20 flex items-center justify-center',
                        })}
                      >
                        <Input {...getInputProps()} />
                        <FormDescription>Click to open or drop your file here.</FormDescription>
                      </div>
                    )}
                  </FormControl>
                  <FormDescription>This is the file exported from Figma.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {loading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
