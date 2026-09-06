import { getCollection, type CollectionEntry } from 'astro:content';

import { validateArticlePath } from './article-utils';
import { groupByTag, type TagGroup } from './tag-utils';

export type Article = CollectionEntry<'articles'>;
export type TagSummary = TagGroup<Article>;

/**
 * 公開対象の記事を、新しい順で返す。draft は本番ビルドでのみ除外する。
 * 併せて `YYYY/MM/DD/slug` というパスの形と pubDate の一致を検証する。
 */
export async function getPublishedArticles(): Promise<Article[]> {
  // draft も含めて先に検証する。draft のうちに間違いへ気付けるようにするため、
  // 本番ビルドで除外されるものも対象にする。
  const articles = await getCollection('articles');

  for (const article of articles) {
    validateArticlePath(article.id, article.data.pubDate);
  }

  const visible = import.meta.env.PROD
    ? articles.filter(({ data }) => data.draft !== true)
    : articles;

  return visible.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** 全記事からタグ一覧を集計する。記事数の多い順、同数なら名前順。 */
export async function getTagSummaries(): Promise<TagSummary[]> {
  const articles = await getPublishedArticles();

  return groupByTag(
    articles.map((article) => ({ item: article, tags: article.data.tags })),
  );
}
