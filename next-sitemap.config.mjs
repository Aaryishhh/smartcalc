/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: 'https://smartcalculator.uk',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/'
      }
    ],
  },
  exclude: [],
  generateIndexSitemap: false,
  outDir: 'public',
  // Add all your static routes to ensure they're included in the sitemap
  additionalPaths: async () => {
    return [
      { loc: '/', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 1.0 },
      { loc: '/basic-calculator', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.6 },
      { loc: '/about', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.5 },
      // Add all calculator routes
      { loc: '/income-tax', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.8 },
      { loc: '/capital-gains', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.7 },
      { loc: '/vat', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.7 },
      { loc: '/property-tax', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.7 },
    ];
  },
};
