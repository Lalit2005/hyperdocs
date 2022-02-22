import { Button } from '@/components/ui/Button';
import { DialogContent, DialogRoot } from '@/components/ui/Dialog';
import DashboardLayout from '@/layouts/DashboardLayout';
import slugify from '@/lib/slugify';
import { Blog } from '@prisma/client';
import { DialogTrigger } from '@radix-ui/react-dialog';
import axios from 'axios';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Eye, Save, Settings, Zap } from 'react-feather';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { Tooltip } from 'react-tiny-tooltip';
import useSWR from 'swr';

const BlogPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<Blog>(
    `/api/get/blog/?blogId=${router.query.blogId}`
  );
  const [content, setContent] = useState<string>(data?.content || '');

  const { register, handleSubmit } =
    useForm<{
      siteSlug: string;
      title: string;
      description: string;
      ogImageUrl: string;
      postedBy: string;
    }>();

  return (
    <DashboardLayout
      title={data?.title || '...'}
      subtitle={data?.description || '...'}
      active='blog'>
      <div>
        <Button
          noInvert
          className='mr-4'
          onClick={() => {
            const req = axios
              .post('/api/update/blog', {
                blogId: router.query.blogId,
                content,
              })
              .then(() => {
                // mutate data
                data &&
                  mutate({
                    ...data,
                    content,
                  });
              });
            toast.promise(req, {
              success: 'Blog updated!',
              error: 'Error updating blog!',
              loading: 'Updating blog...',
            });
          }}>
          <Save className='inline-block relative -top-px mr-1' size={18} /> Save
        </Button>
        <Button noInvert className='mr-4'>
          <Eye className='inline-block relative -top-px mr-1' size={18} />{' '}
          Preview
        </Button>
        <Button noInvert className='mr-4'>
          <Zap className='inline-block relative -top-px mr-1' size={18} /> View
          all components
        </Button>
        <DialogRoot>
          <DialogTrigger>
            <Button>
              <Settings
                className='inline-block relative -top-px mr-1'
                size={18}
              />{' '}
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent title='Settings'>
            <div className='mt-7'>
              <Button
                noInvert
                onClick={() => {
                  const req = axios
                    .post('/api/update/blog-status', {
                      isPublished: !data?.published,
                      blogId: router.query.blogId,
                    })
                    .then(() => {
                      // mutate data
                      data &&
                        mutate({
                          ...data,
                          published: !data?.published,
                        });
                      toast.promise(req, {
                        success: 'Blog status updated!',
                        error: 'Error updating blog status!',
                        loading: 'Updating blog status...',
                      });
                    });
                }}>
                {data?.published ? 'Unpublish' : 'Publish'} post
              </Button>
            </div>
            <div className='mt-5'>
              <form
                className='space-y-3'
                onSubmit={handleSubmit((data) => {
                  const req = axios
                    .post('/api/update/blog-settings', {
                      blogId: router.query.blogId,
                      ...data,
                    })
                    .then(({ data: res }) => {
                      // mutate
                      data &&
                        mutate({
                          ...data,
                          ...res,
                        });
                    });
                  toast.promise(req, {
                    success: 'Blog updated!',
                    error: 'Error updating blog!',
                    loading: 'Updating blog...',
                  });
                })}>
                <div>
                  <H3>Site slug</H3>
                  <input
                    placeholder={slugify(data?.title || '')}
                    className='text-input'
                    defaultValue={data?.slug || ''}
                    {...register('siteSlug')}
                  />
                </div>
                <div>
                  <H3>Blog title</H3>
                  <input
                    placeholder='Hello Hyperdocs'
                    className='text-input'
                    defaultValue={data?.title || ''}
                    {...register('title')}
                  />
                </div>
                <div>
                  <H3>Blog description</H3>
                  <input
                    placeholder='Introducing the simplest way to create documentation sites'
                    className='text-input'
                    defaultValue={data?.description || ''}
                    {...register('description')}
                  />
                </div>
                <div>
                  <H3>Og Image URL</H3>
                  <input
                    placeholder='https://picsum.photos/1200/630'
                    className='text-input'
                    defaultValue={data?.ogImageUrl || ''}
                    {...register('ogImageUrl')}
                  />
                </div>
                <div>
                  <H3>Posted by (GitHub username)</H3>
                  <input
                    placeholder='lalit2005'
                    className='text-input'
                    defaultValue={data?.postedBy || ''}
                    {...register('postedBy')}
                  />
                </div>
                <Button type='submit'>Update</Button>
              </form>
            </div>
          </DialogContent>
        </DialogRoot>
      </div>
      <div className='inline-block'>
        <Tooltip
          side='top'
          content={
            data?.published
              ? 'The blog post is published now. To update, just edit the content below and save it'
              : 'The blog is not published yet. Publish from the settings → '
          }>
          {data?.published ? (
            <div className='rounded-sm text-teal-800 bg-teal-200 inline-block text-xs px-1 py-px mt-4'>
              Blog Published
            </div>
          ) : (
            <div className='rounded-sm text-red-800 bg-red-200 inline-block text-xs px-1 py-px mt-4'>
              Blog not Published yet
            </div>
          )}
        </Tooltip>
      </div>
      <div className='mt-10'>
        <ReactTextareaAutosize
          defaultValue={data?.content || ''}
          className='w-full max-w-3xl font-mono bg-white dark:bg-black focus:outline-none text-slate-900 dark:text-slate-300'
          spellCheck={false}
          minRows={15}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Write your blog post in markdown here'
        />
      </div>
      <style jsx>{`
        input {
          width: 100%;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default BlogPage;

const H3: React.FC<{ className?: string }> = ({ className, ...props }) => {
  return (
    <h3 className={clsx('text-lg font-medium', className)}>{props.children}</h3>
  );
};
