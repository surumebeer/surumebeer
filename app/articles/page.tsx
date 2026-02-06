import Link from "next/link"
import type { Metadata } from "next"
import { TagList } from '../components/tag-badge'
import { getArticles } from '@/lib/content/loader'

export const metadata: Metadata = {
  title: "Articles",
}

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">記事がありません。</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block p-6 border rounded-lg hover:bg-accent transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <div className="flex flex-col gap-2">
                <time className="text-sm text-muted-foreground">
                  {new Date(article.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {article.tags && article.tags.length > 0 && (
                  <TagList tags={article.tags} size="sm" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
