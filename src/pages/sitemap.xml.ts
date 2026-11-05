import { getPosts, site } from '../lib/content';

// Every page Google should index. Redirect pages and the /archive/ copy of the old site are left out on purpose.
export async function GET() {
  const base = 'https://vivekruhela.github.io';
  const posts = await getPosts();
  const today = new Date().toISOString().slice(0, 10);
  const urls = site().beta ? [] : [
    { loc: `${base}/`, lastmod: today },
    { loc: `${base}/blog/`, lastmod: posts[0]?.data.date.toISOString().slice(0, 10) ?? today },
    ...posts.map((p) => ({ loc: `${base}/blog/${p.id}/`, lastmod: p.data.date.toISOString().slice(0, 10) })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
