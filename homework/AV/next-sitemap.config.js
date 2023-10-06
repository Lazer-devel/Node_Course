const disallowUrl = [
  '/filter',
  '/new_ad',
  '/registration',
  '/server-sitemap.xml',
]

const disallowPolicies = disallowUrl.map((url) => {
  return {
    userAgent: '*',
    disallow: url,
  }
})

module.exports = {
  siteUrl: process.env.SITE_URL || 'http://167.99.141.158',
  generateRobotsTxt: true,

  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }, ...disallowPolicies],
    additionalSitemaps: [`${process.env.SITE_URL}/server-sitemap.xml`],
  },
  exclude: disallowUrl,

  transform: async (config, path) => {
    switch (path) {
      case '/':
        return {
          loc: path,
          changefreq: 'yearly',
          priority: 1,
          lastmod: new Date().toISOString(),
        }

      case '/catalog':
        return {
          loc: path,
          changefreq: 'hourly',
          priority: 0.9,
          lastmod: new Date().toISOString(),
        }
      default:
        return null
    }
  },
}
