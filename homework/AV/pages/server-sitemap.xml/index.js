import { getServerSideSitemapLegacy } from 'next-sitemap'

export const getServerSideProps = async (context) => {
  let response = await fetch('http://167.99.141.158/api/marks')
  const marks = await response.json()

  const markUrls = []
  const modelUrls = []
  const generationUrls = []

  await Promise.all(
    marks.map(async (mark) => {
      const res = await fetch(`http://167.99.141.158/api/models?mark=${mark}`)

      const models = await res.json()

      await Promise.all(
        models.map(async (model) => {
          const res = await fetch(
            `http://167.99.141.158/api/ads?mark=${mark}&model=${model}`
          )

          const ads = await res.json()
          console.log(ads)
          ads.forEach((gen) => {
            generationUrls.push({
              loc: `http://167.99.141.158/catalog/${mark}/${model}/${gen.id}`,
              lastmod: new Date().toISOString(),
              changefreq: 'daily',
              priority: 0.6,
            })
          })

          modelUrls.push({
            loc: `http://167.99.141.158/catalog/${mark}/${model}`,
            lastmod: new Date().toISOString(),
            changefreq: 'hourly',
            priority: 0.8,
          })
        })
      )

      markUrls.push({
        loc: `http://167.99.141.158/catalog/${mark}`,
        lastmod: new Date().toISOString(),
        changefreq: 'hourly',
        priority: 0.8,
      })
    })
  )

  return await getServerSideSitemapLegacy(context, [
    ...markUrls,
    ...modelUrls,
    ...generationUrls,
  ])
}

const Sitemap = () => {}

export default Sitemap
