import { getCollection } from 'astro:content';
import { KINDS, POST_TYPES, getWork, getPosts, ambitions } from '../lib/content';

export async function GET() {
  const journey = await getCollection('journey');
  const tools = await getCollection('tools');
  const items = [
    ...journey.map((j) => ({ t: 'Chapter', x: `${j.data.title} · ${j.data.where}`, u: `/?j=${j.id}#journey` })),
    ...(await getWork()).map((w) => ({ t: KINDS[w.kind].n.split(' ')[0], x: `${w.title} · ${w.venue}`, u: `/?w=${w.id}#work` })),
    ...(await getPosts()).map((p) => ({ t: POST_TYPES[p.data.type].split(' ')[0], x: `${p.data.title} · ${p.data.summary}`, u: `/blog/${p.id}/` })),
    ...tools.map((t) => ({ t: 'Tool', x: `${t.data.name} · ${t.body?.trim()}`, u: '/#tools' })),
    ...ambitions().map((a) => ({ t: 'Ambition', x: a.hypothesis, u: '/#next' })),
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}
