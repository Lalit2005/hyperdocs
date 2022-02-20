import DocsMDXcomponents from '@/components/docs/documentation/components';
import MDXRenderer from '@/components/docs/MDXRenderer';
import DocsNav from '@/components/docs/navbar';
import bundleMdxContent from '@/lib/mdx-bundler';
import prisma from '@/utils/prisma';
import { NavbarLink } from '@prisma/client';
import { getMDXComponent } from 'mdx-bundler/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useMemo } from 'react';

const BlogPage: NextPage<{
  mdxCode: string;
  updatedAt: string;
  ogImageUrl: string;
  title: string;
  description: string;
  navbarLinks: NavbarLink[];
  navbarCta: string;
  logo: string;
}> = ({
  mdxCode,
  description,
  logo,
  navbarCta,
  navbarLinks,
  ogImageUrl,
  title,
  updatedAt,
}) => {
  const Component = useMemo(() => getMDXComponent(mdxCode), [mdxCode]);
  return (
    <div>
      <DocsNav links={navbarLinks} navbarCta={navbarCta} logo={logo} />
      <main className='max-w-4xl mx-auto p-5 mt-10'>
        <h2 className='text-5xl font-extrabold'>{title}</h2>
        <p className='text-slate-600 text-lg dark:text-slate-400 my-2'>
          {description}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogImageUrl}
          alt=''
          className='rounded-xl mt-10'
          width={1200}
          height={600}
        />
        <div className='mt-14'>
          <MDXRenderer>
            {/* @ts-ignore */}
            <Component components={DocsMDXcomponents} />
          </MDXRenderer>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const blog = await prisma.blog.findFirst({
    where: {
      slug: params?.blogSlug as string,
      site: {
        siteSlug: params?.slug as string,
      },
    },
    include: {
      site: {
        include: {
          navbarLinks: true,
        },
      },
    },
  });

  const mdxCode = (await bundleMdxContent(blog?.content || '')).code;

  return {
    props: {
      mdxCode,
      updatedAt: blog?.updatedAt.toString(),
      ogImageUrl: blog?.ogImageUrl,
      title: blog?.title,
      description: blog?.description,
      navbarLinks: blog?.site?.navbarLinks,
      navbarCta: blog?.site?.navbarCta,
      logo: blog?.site?.siteName,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};