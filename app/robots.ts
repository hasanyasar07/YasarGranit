import { MetadataRoute } from 'next'

// AI arama motorlarının (GEO) crawler'ları bazen açık kural arar; '*' altında
// zaten izinli olsalar da isimli kural taranma güvenilirliğini artırır.
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bingbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/admin/', '/api/'],
      })),
    ],
    sitemap: 'https://yasargranit.com/sitemap.xml',
    host: 'https://yasargranit.com',
  }
}
