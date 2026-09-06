---
title: Astro でサイトを刷新した
description: Next.js から Astro へ移行し、記事とタグを書けるようにした話。
pubDate: 2026-09-06
tags: ['Astro', 'TypeScript', 'GitHub Pages']
draft: false
---

このサイトを Next.js から [Astro](https://astro.build/) へ刷新しました。

## 記事の置き場所

記事は `src/content/articles/` の下に、公開日の `YYYY/MM/DD/` ディレクトリを掘って
Markdown ファイルとして置きます。パスがそのまま URL になります。

```
src/content/articles/2026/09/06/hello-astro.md
  ->  /articles/2026/09/06/hello-astro/
```

ディレクトリの日付と frontmatter の `pubDate` が食い違うとビルドが失敗します。

## フロントマター

```yaml
---
title: 記事のタイトル
description: 一覧に表示する説明（任意）
pubDate: 2026-09-06
tags: ['Astro', 'TypeScript']
draft: false
---
```

`tags` に付けたタグは `/tags/` に自動で集約されます。

## シンタックスハイライト

コードブロックは Shiki でハイライトされます。ライト／ダークの両テーマに対応しています。

```ts
type Article = {
  title: string;
  tags: string[];
};

const article: Article = {
  title: 'Astro でサイトを刷新した',
  tags: ['Astro'],
};

console.log(article.tags.join(', '));
```

```bash
npm run dev    # 開発サーバー
npm run build  # dist/ へ静的出力
```
