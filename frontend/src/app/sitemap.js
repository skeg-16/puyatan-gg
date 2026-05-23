export default function sitemap() {
  return [
    {
      url: 'https://puyatan-gg.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: 'https://puyatan-gg.vercel.app/terms',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://puyatan-gg.vercel.app/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
