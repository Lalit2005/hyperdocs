import Head from 'next/head';

const MDXRenderer: React.FC = (props) => {
  return (
    <div className='prose-lg prose-slate px-3 text-slate-800 prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:text-slate-800 prose-a:rounded-sm prose-a:p-[2px] prose-a:text-blue-500 hover:prose-a:bg-blue-100 prose-blockquote:border-l-4 prose-blockquote:border-slate-600 prose-blockquote:py-1 prose-pre:overflow-x-scroll prose-pre:bg-[#282C34] prose-ol:list-decimal prose-ul:list-disc dark:prose-invert dark:text-slate-200 dark:prose-headings:text-slate-50 dark:prose-a:text-blue-400 dark:hover:prose-a:bg-slate-700 dark:prose-hr:divide-slate-600'>
      <Head>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/atom-one-dark.min.css'
        />
      </Head>
      {props.children}
    </div>
  );
};

export default MDXRenderer;
