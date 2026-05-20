import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const promptsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/prompts' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    tool: z.string(),
    difficulty: z.enum(['入门', '进阶', '高级']),
    date: z.date(),
    seoDescription: z.string().optional(),
    affiliate_links: z.array(z.object({
      name: z.string(),
      url: z.string(),
      description: z.string().optional(),
    })).default([]),
  }),
});

export const collections = {
  prompts: promptsCollection,
};
