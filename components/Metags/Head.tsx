import { memo, useMemo } from 'react';
import Head from 'next/head';

export const siteTitle = 'Expo';
const defaultDescription = 'Expo description';
const defaultSep = ' | ';
const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:${process.env.PORT || 3000}`
    : process.env.NEXT_PUBLIC_SITE_URL;

// const FACEBOOK_APP_ID = 'XXXXXXXXX';
const defaultImage = `${SITE_URL}/images/logo.png`;

export type MetaTagsProps = {
  titleDefault?: string;
  title?: string;
  description?: string;
  image?: string;
  contentType?: string;
  twitter?: string;
  noCrawl?: string;
  category?: string;
  published?: string;
  updated?: string;
  tags?: string;
  location?: Location;
  schema?: string;
};

export default memo(({ title, description, ...rest }: MetaTagsProps) => {
  const titleChecked = useMemo(() => {
    if (rest.titleDefault) {
      return rest.titleDefault;
    }
    if (title) {
      return title + defaultSep + siteTitle;
    }
    return siteTitle;
  }, [title, rest.titleDefault]);

  const desc = useMemo(() => description || defaultDescription, [description]);

  return (
    <Head>
      <link rel="shortcut icon" href="/logo.png" />
      <title>{titleChecked}</title>
      <meta name="description" content={desc} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <meta
        property="og:image"
        content={rest.image ? rest.image : defaultImage}
      />
    </Head>
  );
});
