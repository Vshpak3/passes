// react
import { memo, ReactNode } from 'react';
// next
import Link from 'next/link';
// application
import Head from '@components/Metags/Head';

interface IProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

function Layout({ title, description, children }: IProps) {
  return (
    <>
      <Head title={title} description={description} />
      <div className="bg-primary min-h-screen min-w-screen auth-page">
        <main className="container">
          <div className="flex justify-center pt-7 flex-col">
            <div className="block self-center">
              <Link href="/">
                <img src="logo.png" alt="" width={56} />
              </Link>
            </div>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default memo(Layout);
