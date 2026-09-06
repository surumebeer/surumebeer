/**
 * タグの正規化・slug 化・集約を行う純粋関数群。
 * astro:content に依存しないので単体テストできる。
 */

/** 前後の空白を落とし、連続する空白を 1 つにまとめる。 */
export function normalizeTagName(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ');
}

/**
 * 比較用キー。大文字小文字と、空白・アンダースコア・ハイフンの
 * 表記ゆれを吸収する（`GitHub Pages` と `github_pages` は同じタグ）。
 */
function tagKey(tag: string): string {
  return normalizeTagName(tag)
    .toLowerCase()
    .replace(/[\s_-]+/g, ' ');
}

/**
 * タグ名を URL に使える slug へ変換する。
 * slug 化できない場合は空文字を返す。
 */
export function tagToSlug(tag: string): string {
  return tagKey(tag)
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 表示用にタグを整形する。前後の空白を落とし、slug 化できないタグを捨て、
 * 表記ゆれを含む重複を最初の表記に寄せて 1 つにまとめる。
 */
export function normalizeTags(tags: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const key = tagKey(tag);
    if (tagToSlug(tag) === '' || seen.has(key)) continue;
    seen.add(key);
    result.push(normalizeTagName(tag));
  }

  return result;
}

export type TaggedItem<T> = {
  item: T;
  tags: string[];
};

export type TagGroup<T> = {
  /** 表示用のタグ名。最初に出現した表記を採用する。 */
  name: string;
  slug: string;
  items: T[];
};

/**
 * タグ付きの要素をタグごとにまとめる。
 * 並び順は要素数の多い順、同数ならタグ名の昇順。
 *
 * @throws 異なるタグが同じ slug に衝突した場合（ページ URL が衝突するため）
 */
export function groupByTag<T>(entries: TaggedItem<T>[]): TagGroup<T>[] {
  const groups = new Map<string, TagGroup<T>>();
  const slugOwner = new Map<string, string>();

  for (const entry of entries) {
    // 同じ記事内での重複タグ（表記ゆれを含む）は normalizeTags が 1 つにまとめる。
    for (const rawTag of normalizeTags(entry.tags)) {
      const key = tagKey(rawTag);
      const slug = tagToSlug(rawTag);

      const owner = slugOwner.get(slug);
      if (owner === undefined) {
        slugOwner.set(slug, key);
      } else if (owner !== key) {
        throw new Error(
          `タグ "${rawTag}" の slug "${slug}" が既存のタグ "${owner}" と衝突しています。どちらかのタグ名を変更してください。`,
        );
      }

      const group = groups.get(key);
      if (group) {
        group.items.push(entry.item);
      } else {
        groups.set(key, { name: rawTag, slug, items: [entry.item] });
      }
    }
  }

  return [...groups.values()].sort(
    (a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name),
  );
}
