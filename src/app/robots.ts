import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/kasse/', '/konto/', '/login/'],
      },
    ],
    sitemap: 'https://suedpfote.de/sitemap.xml',
  };
}
