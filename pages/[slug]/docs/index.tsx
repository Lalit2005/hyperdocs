import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import prisma from '@/utils/prisma';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';
import bundleMdxContent from '@/lib/mdx-bundler';
import DocsNav from '@/components/docs/navbar';
import getAllFiles from '@/utils/getAllFiles';
import getFileContent from '@/utils/getFile';
import { Remarkable } from 'remarkable';
// @ts-ignore
import mdToc from 'markdown-toc';
import DocsLayout from '@/layouts/DocsLayout';
import { DocsPageProps } from 'types/types';
import MDXRenderer from '@/components/docs/MDXRenderer';
import DocsMDXcomponents from '@/components/docs/documentation/components';
import Link from 'next/link';
import getSidebar from '@/lib/getSidebar';
// @ts-ignore
const Page: NextPage<DocsPageProps> = ({
  content,
  tocHtml,
  navLinks,
  navCta,
  siteName,
  sidebar,
  slug,
  siteId,
  footerText,
}) => {
  const Component = useMemo(() => getMDXComponent(content), [content]);
  return (
    <div>
      <div>
        <div className='sticky top-0 z-50'>
          <DocsNav
            slug={slug}
            links={navLinks}
            navbarCta={navCta}
            logo={siteName}
          />
        </div>
        <DocsLayout
          siteId={siteId}
          LeftSidebarContent={() => (
            <ul className='mt-10 space-y-4'>
              {sidebar.map((file: string) => {
                return (
                  <li key={file}>
                    <Link href={`/${slug}/docs/${file}`}>
                      <a className='block rounded px-3 py-2 capitalize hover:bg-slate-50 dark:hover:bg-slate-800'>
                        {file.replace(/-/gi, ' ')}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          RightSidebarContent={() => (
            <div>
              <div className='prose-sm prose-ul:relative prose-ul:-left-5 dark:prose-invert'>
                <p className='mb-5 font-semibold text-sm'>On this page</p>
                <ul dangerouslySetInnerHTML={{ __html: tocHtml }}></ul>
              </div>
            </div>
          )}
          footerText={footerText}>
          <MDXRenderer>
            {/* @ts-ignore */}
            <Component components={DocsMDXcomponents} />
          </MDXRenderer>
        </DocsLayout>
      </div>
    </div>
  );
};

export default Page;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const filename = 'index';

  console.log(filename);

  const siteData = await prisma.site.findUnique({
    where: {
      siteSlug: slug,
    },
    include: {
      navbarLinks: true,
    },
  });

  const mdToHtml = new Remarkable();

  const allFiles = await getAllFiles(
    siteData?.repoLink || '',
    siteData?.gitHubAccessToken || ''
  );

  console.log(allFiles);

  let sidebar;

  try {
    sidebar = await getSidebar(siteData);
  } catch (error) {
    console.log(error);
    // @ts-ignore
    let filesArray: string[] = allFiles.data.map((file) =>
      file.name.replace(/\.md$/, '')
    );

    sidebar = filesArray.filter((file: string) => file !== 'index');
  }

  let content;

  try {
    content = await getFileContent(
      siteData?.repoLink || '',
      filename + '.md',
      siteData?.gitHubAccessToken?.toString()
    );
  } catch (error) {
    content = await getFileContent(
      siteData?.repoLink || '',
      sidebar[0] + '.md',
      siteData?.gitHubAccessToken?.toString()
    );
  }

  const tocHtml = mdToHtml.render(mdToc(content).content);

  return {
    // * Make sure to change the DocsPageProps in @types/types.ts
    props: {
      content: (await bundleMdxContent(`${content.toString().trim()}`)).code,
      tocHtml: tocHtml,
      sidebar: sidebar,
      navLinks: siteData?.navbarLinks,
      navCta: siteData?.navbarCta,
      siteName: siteData?.siteName,
      slug: siteData?.siteSlug,
      siteId: siteData?.id,
      footerText: siteData?.footerText,
    },
    revalidate: 15 * 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
