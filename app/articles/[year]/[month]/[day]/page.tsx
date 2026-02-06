import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { TagList } from '../../../../components/tag-badge'
import { getDateBasedStaticParams, loadContentWithHtml } from '@/lib/content/loader'

export const dynamicParams = false

export function generateStaticParams() {
  return getDateBasedStaticParams('articles', { year: '1970', month: '01', day: '01' })
}

interface PageProps {
  params: Promise<{
    year: string
    month: string
    day: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, month, day } = await params
  const article = await loadContentWithHtml('articles', year, month, day)

  if (!article) {
    return { title: "記事が見つかりません" }
  }

  return {
    title: `${article.metadata.title || 'Untitled'} - ${article.metadata.date || `${year}-${month}-${day}`}`
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { year, month, day } = await params
  const article = await loadContentWithHtml('articles', year, month, day)

  if (!article) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        {article.metadata.title && (
          <h1 className="text-4xl font-bold mb-4">{article.metadata.title}</h1>
        )}
        <div className="flex flex-col gap-4 mb-8">
          {article.metadata.date && (
            <time className="text-muted-foreground text-sm">
              {new Date(article.metadata.date).toLocaleDateString('ja-JP')}
            </time>
          )}
          {article.metadata.tags && (
            <TagList tags={article.metadata.tags} />
          )}
        </div>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </article>
    </div>
  )
}
