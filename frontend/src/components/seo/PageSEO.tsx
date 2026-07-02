import React from 'react';
import { Helmet } from 'react-helmet-async';

const OG_IMAGE = 'https://airigcheck.com/og-image.png';
const SITE_NAME = 'AIRigCheck';

interface PageSEOProps {
  title: string;
  description: string;
  canonical: string;
  schema?: Record<string, unknown>;
}

export const PageSEO: React.FC<PageSEOProps> = ({ title, description, canonical, schema }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={OG_IMAGE} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={OG_IMAGE} />

    {schema && (
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    )}
  </Helmet>
);
