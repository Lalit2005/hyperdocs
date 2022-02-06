import ProfileDropdown from '@/components/ProfileDropdown';
import { CustomLink } from '@/components/ui/Link';
import { Heading1 } from '@/components/ui/Typography';
import ProtectedRoute from '@/lib/ProtectedRoute';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

type ActiveTab =
  | 'overview'
  | 'snippet-injection'
  | 'blog'
  | 'feedbacks'
  | 'integrations'
  | 'settings';

interface SideBarLinks {
  name: string;
  href: string;
  active: ActiveTab;
}

const DashboardLayout: React.FC<{
  title: string;
  subtitle: string;
  active: ActiveTab;
}> = ({ title, subtitle, active, ...props }) => {
  const router = useRouter();
  const siteId = router.query.siteId as string;
  const { data } = useSession();
  const user = data?.user;

  const sideBarLinks: SideBarLinks[] = [
    {
      name: 'Overview',
      href: `/dashboard/${siteId}`,
      active: 'overview',
    },
    {
      name: 'Snippet injection',
      href: `/dashboard/${siteId}/snippet-injection`,
      active: 'snippet-injection',
    },
    {
      name: 'Blog',
      href: `/dashboard/${siteId}/blog`,
      active: 'blog',
    },
    {
      name: `Feedbacks`,
      href: `/dashboard/${siteId}/feedbacks`,
      active: 'feedbacks',
    },
    {
      name: `Integrations`,
      href: `/dashboard/${siteId}/integrations`,
      active: 'integrations',
    },
    {
      name: `Settings`,
      href: `/dashboard/${siteId}/settings`,
      active: 'settings',
    },
  ];

  return (
    <ProtectedRoute>
      <div className='flex w-screen h-screen'>
        <aside className='w-2/12 border-r-2 border-r-slate-200 dark:border-r-slate-800 pt-24 relative'>
          <ul className='space-y-3 px-4'>
            {sideBarLinks.map((link, index) => {
              return (
                <li key={index}>
                  <CustomLink
                    href={link.href}
                    noInvert
                    className={clsx(
                      'border-none',
                      active === link.active &&
                        'font-semibold !bg-slate-100 dark:!bg-slate-700 dark:!text-white'
                    )}>
                    {link.name}
                  </CustomLink>
                </li>
              );
            })}
          </ul>
          <div>
            <div className='absolute bottom-0 w-full inline-block'>
              <div>
                <CustomLink
                  href='/dashboard'
                  noInvert
                  className='text-slate-400 hover:font-bold text-sm py-3 block mt-3 border-none px-5 !bg-slate-100 dark:!bg-slate-900'>
                  {'<-'} Go back
                </CustomLink>
                {/* <Link href='/dashboard'>
                  <a className=''></a>
                </Link> */}
              </div>
              <div className='justify-between px-5 py-2 pt-5 bg-slate-100 dark:bg-slate-900 items-center border-t border-t-slate-300 dark:border-t-slate-700'>
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </aside>
        <main className='w-10/12 pl-16 mt-24'>
          <Heading1>{title}</Heading1>
          <p className='text-lg text-light mt-5 mb-16'>
            <ReactMarkdown>{subtitle}</ReactMarkdown>
          </p>
          {props.children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
