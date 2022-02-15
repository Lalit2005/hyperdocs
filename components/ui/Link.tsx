import clsx from 'clsx';
import { AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

export const CustomLink: React.FC<
  AnchorHTMLAttributes<HTMLAnchorElement> & { noInvert?: boolean }
> = ({ noInvert = false, ...props }) => {
  return (
    <Link href={props.href || '/'}>
      <a
        {...props}
        className={clsx(
          'text-invert m-px block rounded border border-black px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-white',
          noInvert === true &&
            'text-no-invert border !border-slate-400 hover:bg-slate-100 dark:!border-slate-500 dark:hover:bg-slate-800',
          props?.className
        )}
      >
        {props.children}
      </a>
    </Link>
  );
};
