import { MetadataRoute } from 'next'
import { toolsConfig } from '@/lib/tools-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.ponpaku.com'
  
  // ホームページ
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ]

  // 各ツールページを追加
  toolsConfig.categories.forEach(category => {
    category.tools.forEach(tool => {
      routes.push({
        url: `${baseUrl}${tool.path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  // カテゴリページがある場合（将来的な拡張用）
  // toolsConfig.categories.forEach(category => {
  //   routes.push({
  //     url: `${baseUrl}/category/${category.id}`,
  //     lastModified: new Date(),
  //     changeFrequency: 'weekly', 
  //     priority: 0.6,
  //   })
  // })

  return routes
}