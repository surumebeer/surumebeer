import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/** TOP ページに表示する Profile。リポジトリ直下の README.md をそのまま読み込む。 */
const profile = defineCollection({
  loader: glob({ pattern: 'README.md', base: '.' }),
});

/**
 * 日付は `YYYY-MM-DD`（時刻なし）だけを受け付ける。
 * 時刻やオフセットを許すと、ディレクトリの日付と比べるときに
 * どのタイムゾーンの暦日なのかが曖昧になるため。
 */
const dateOnly = z.coerce
  .date()
  .refine(
    (date) => date.valueOf() === Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
    { message: '日付は YYYY-MM-DD 形式（時刻なし）で書いてください' },
  );

/**
 * 記事。`src/content/articles/{YYYY}/{MM}/{DD}/{slug}.md` が
 * `/articles/{YYYY}/{MM}/{DD}/{slug}/` になる。
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: dateOnly,
    updatedDate: dateOnly.optional(),
    tags: z.array(z.string().trim().min(1, 'タグ名を空にはできません')).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { profile, articles };
