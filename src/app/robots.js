export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: 'https://smartcalculator.uk/sitemap.xml',
    host: 'https://smartcalculator.uk',
  }
}
