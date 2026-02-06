// gray-matter の data を安全に扱うための frontmatter 型
export interface ContentFrontmatter {
  title?: string
  date?: string
  isPublished?: boolean
  tags?: string[]
  image?: string
  description?: string
}

// 日付ベースコンテンツ (articles, learning-css) の日付パーツ
export interface DateParts {
  year: string
  month: string
  day: string
}

// 一覧ページ用: 日付ベースコンテンツのメタデータ
export interface DateBasedEntry extends DateParts {
  slug: string
  title: string
  date: string
  isPublished: boolean
}

// articles 一覧用
export interface ArticleEntry extends DateBasedEntry {
  tags: string[]
}

// products 一覧用
export interface ProductEntry {
  slug: string
  title: string
  image: string
  description: string
  date: string
  isPublished: boolean
}

// 詳細ページ用: コンテンツ読み込み結果
export interface ContentResult {
  metadata: ContentFrontmatter
  content: string
}

export interface ContentWithHtml {
  metadata: ContentFrontmatter
  contentHtml: string
}
