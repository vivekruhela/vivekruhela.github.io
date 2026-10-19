// Shared loaders so the home page, blog and search index read content the same way.
import { getCollection } from 'astro:content';
import yaml from 'js-yaml';
import fs from 'node:fs';

export const site = () => yaml.load(fs.readFileSync('src/data/site.yaml', 'utf8')) as any;
export const ambitions = () => yaml.load(fs.readFileSync('src/data/ambitions.yaml', 'utf8')) as any[];

// h = row on the Manhattan plot's y-axis. Above 4.2 = above the "peer-reviewed or granted" line.
export const KINDS = {
  patent: { n: 'Patent', s: 'Patent',  c: '--patent', h: 6 },
  journal: { n: 'Journal article', s: 'Journal',  c: '--nC', h: 5 },
  preprint: { n: 'Preprint', s: 'Preprint',  c: '--nA', h: 3.4 },
  abstract: { n: 'Conference abstract', s: 'Abstract',  c: '--nG', h: 2.5 },
  talk: { n: 'Oral talk', s: 'Talk',  c: '--nT', h: 1.6 },
  tool: { n: 'Software', s: 'Software',  c: '--muted', h: 0.7 },
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
        y: d.getUTCFullYear() + (d.getUTCMonth() + (d.getUTCDate() - 1) / 31) / 12, // fraction of the year, always < next year
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
