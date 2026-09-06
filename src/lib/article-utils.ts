/**
 * 記事のパスと日付を扱う純粋関数群。
 * astro:content に依存しないので単体テストできる。
 */

/** Date を UTC の YYYY-MM-DD に整形する。 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export type ArticlePath = {
  year: string;
  month: string;
  day: string;
  slug: string;
  /** パスが表す日付の YYYY-MM-DD 表記 */
  date: string;
};

const ARTICLE_PATH_PATTERN = /^(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)$/;

/**
 * 記事の id (`2026/09/06/hello-astro`) を分解する。
 * 形が違う、または存在しない日付の場合は null を返す。
 */
export function parseArticlePath(id: string): ArticlePath | null {
  const match = id.match(ARTICLE_PATH_PATTERN);
  if (match === null) return null;

  const [, year, month, day, slug] = match;
  const date = `${year}-${month}-${day}`;

  // 2026/02/30 のような存在しない日付を弾く。
  // Date は繰り上げてしまうので、往復させて一致を確認する。
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || formatDate(parsed) !== date) return null;

  return { year, month, day, slug, date };
}

/**
 * 記事の id が `YYYY/MM/DD/slug` の形で、かつ frontmatter の `pubDate` と
 * 一致していることを確かめる。
 *
 * 日付がディレクトリと frontmatter の 2 箇所にあるので、
 * 黙って食い違うよりビルドを止める。
 *
 * @throws 形が違う、または pubDate と食い違う場合
 */
export function validateArticlePath(id: string, pubDate: Date): ArticlePath {
  const parsed = parseArticlePath(id);
  if (parsed === null) {
    throw new Error(
      `記事 "${id}" のパスが YYYY/MM/DD/slug.md の形になっていません（例: src/content/articles/2026/09/06/hello-astro.md）。`,
    );
  }

  const pubDateText = formatDate(pubDate);
  if (pubDateText !== parsed.date) {
    throw new Error(
      `記事 "${id}" の pubDate (${pubDateText}) がディレクトリの日付 (${parsed.date}) と食い違っています。どちらかを直してください。`,
    );
  }

  return parsed;
}
