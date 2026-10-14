// Shared loaders so the home page, blog and search index read content the same way.
import { getCollection } from 'astro:content';
import yaml from 'js-yaml';
import fs from 'node:fs';

export const site = () => yaml.load(fs.readFileSync('src/data/site.yaml', 'utf8')) as any;
export const ambitions = () => yaml.load(fs.readFileSync('src/data/ambitions.yaml', 'utf8')) as any[];

// h = height on the Manhattan plot. Above 7.3 = above the "peer-reviewed" line.
export const KINDS = {
  patent: { n: 'Patent', c: '--patent', h: 10.4 },
  journal: { n: 'Journal article', c: '--nC', h: 8.8 },
  preprint: { n: 'Preprint', c: '--nA', h: 6.4 },
  abstract: { n: 'Conference abstract', c: '--nG', h: 5.6 },
  talk: { n: 'Oral talk', c: '--nT', h: 4.6 },
  tool: { n: 'Software', c: '--muted', h: 3.4 },
} as const;

export const POST_TYPES: Record<string, string> = {
  paper: 'Paper explained',
  method: 'Method',
  idea: 'Idea',
  note: 'Note',
};

export async function getWork() {
  return (await getCollection('work'))
    .sort((a, b) => +a.data.date - +b.data.date)
    .map((w) => {
      const d = w.data.date;
      return {
        id: w.id,
        ...w.data,
        date: d.toISOString().slice(0, 10),
        y: d.getUTCFullYear() + d.getUTCMonth() / 12 + d.getUTCDate() / 365,
        s: w.body?.trim() ?? '',
        ifs: w.data.impact_factor?.toFixed(1), // display form, e.g. 7.0
      };
    });
}

export async function getPosts() {
  return (await getCollection('blog', (p) => !p.data.draft)).sort((a, b) => +b.data.date - +a.data.date);
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
