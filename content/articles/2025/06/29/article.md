---
title: "このportfolioを作った"
date: 2025-06-29
isPublished: true
tags: ["AI", "Claude Code"]
---

Claude Code 盛り上がってるし、触ってみるかと思って、元々作りたかったポートフォリオ作った。  
勢いで Claude Code Max のプラン登録して、とにかく何者かわからんかったので、azukiazusa さんの[バイブコーディングチュートリアル：Claude Code でカンバンアプリケーションを作成しよう](https://azukiazusa.dev/blog/vibe-coding-tutorial-create-app-with-claude-code/)
やってみて、衝撃。  
それならばと作ろう作ろうと思って放置してたものをやることに。  
この記事を書く仕組みとがまぁまぁめんどくさいので、コーディングしてもらったらものの 1 時間で完成。すごいなこれは。  
特に説明することもないけど、仕組みだけメモとして残しておく。

Next.js をベースで UI コンポーネントは[shadcn/ui](https://ui.shadcn.com/)。  
上記の azukiazusa さんの記事のとおりなんだけど、shadcn/ui は元々使用してたので。  
shadcn のカタログ見つつ、「これインストールして、これ作って」みたいな指示で簡単に組み込んでくれる。ありがたい。

記事の仕組みは簡単で、

```
app
└ articles
　 ├ page.tsx
　 └ [year]
　 　 └ [month]
　 　 　 └ [day]
　 　 　 　 └ page.tsx
content
└ articles
　 └ 2025
　 　 └ 06
　 　 　 └ 29
　 　 　 　 └ artcile.md
```

`content` ディレクトリの中に `YYYY/MM/DD` で markdown ファイルを作ったら、対応する `app/articles` のスラッグの中の `page.tsx` で `getStaticParams` して URL 生成して表示してくれる。  
記事増えたらビルド時に対応して markdown 変換しながら生成してくれる、みたいな形にしている。

しているんですが、ぶっちゃけ中身はよくわからんまま、こちらは要件という名のワガママを画面での結果を見ながら叩きつけているだけ。結果として、想定の実装ではあるものの、いろんなロジックはお任せ。  
CSS とかコンポーネントを書き連ねるところも欲しかったので、mdx もできるようにしてもらったり。  
うーん便利。これは向き合う時間増えるわ。
