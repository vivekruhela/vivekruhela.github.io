import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const journey = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journey' }),
  schema: z.object({
    title: z.string(),
    label: z.string(),            // short name drawn on the chromosome band
    from: z.number(),
    to: z.number().optional(),    // leave out for "now"
    where: z.string(),
    tags: z.array(z.string()).default([]),
    pivot: z.boolean().default(false), // draw the centromere where this chapter starts
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['patent', 'journal', 'preprint', 'abstract', 'talk', 'tool']),
    date: z.coerce.date(),
    venue: z.string(),               // journal, conference, or patent office
    link: z.string().optional(),
    impact_factor: z.number().optional(), // journal impact factor, e.g. 12.9
    if_year: z.number().optional(),       // JCR year the impact factor is from
    status: z.string().optional(),        // patents: Filed, Published, Granted
    number: z.string().optional(),        // patents: application or patent number
    featured: z.boolean().default(false), // show as a large spotlight card
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({ name: z.string(), year: z.number(), url: z.string() }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['paper', 'method', 'idea', 'note']).default('note'),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    paper: z.string().optional(),   // file name (without .md) of a work entry this post explains
    draft: z.boolean().default(false),
  }),
});

export const collections = { journey, work, tools, blog };
