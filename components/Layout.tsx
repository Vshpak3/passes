import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';

import Head from '@components/Metags/Head';

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
};

const Layout = ({
  children,
  title = 'This is the default title',
  description = 'This is the default description',
}: Props) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="bg-primary min-h-screen min-w-screen text-white">
      <Head title={title} description={description} />
      <div className="container">
        <header className="float-right py-3">
          <nav>
            <Link href="/">
              <a className="px-2 mx-2 underline">Home</a>
            </Link>
            <button
              type="button"
              className="px-2 mx-2 underline"
              onClick={loginWithRedirect}
            >
              Login
            </button>
            <Link href="/register">
              <a className="px-2 mx-2 underline">Register</a>
            </Link>
            <Link href="/forgot-password">
              <a className="px-2 mx-2 underline">Forgot password</a>
            </Link>
          </nav>
        </header>
        <main className="py-10">{children}</main>
        {/*
          <footer>
            <hr />
            <span>I'm here to stay (Footer)</span>
            </footer>
        */}
      </div>
    </div>
  );
};

export default Layout;
