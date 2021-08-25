import 'styles/global.css';
import 'styles/customize.css';
// next
import type { AppProps, AppContext } from 'next/app';
// third party
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '@graphql/apollo';
import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
// application
import { wrapper } from '@state/store';

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.initialApolloState);
  const { asPath } = useRouter();
  return (
    <ApolloProvider client={client}>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
        clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
        appOrigin={process.env.NEXT_PUBLIC_SITE_URL}
        redirectUri={`${process.env.NEXT_PUBLIC_SITE_URL}${asPath}`}
      >
        <Component {...pageProps} />
      </Auth0Provider>
    </ApolloProvider>
  );
}

export default wrapper.withRedux(MyApp);

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await MyApp.getInitialProps(appContext);
  // let token = '';
  // if (appContext.ctx.req?.headers?.cookie) {
  // }
  return { ...appProps };
};
