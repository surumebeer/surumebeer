import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { Metadata } from 'next'
import { getDateBasedStaticParams, loadContent } from '@/lib/content/loader'
import { mdxComponents } from '@/app/components/mdx'

export const dynamicParams = false

export function generateStaticParams() {
  return getDateBasedStaticParams('learning-css', { year: '1970', month: '01', day: '01' })
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
  const cssTip = loadContent('learning-css', year, month, day)

  if (!cssTip) {
    return { title: "LEARNING CSSコンテンツが見つかりません" }
  }

  return {
    title: `${cssTip.metadata.title || 'Untitled'} - ${cssTip.metadata.date || `${year}-${month}-${day}`}`
  }
}

export default async function CssTipPage({ params }: PageProps) {
  const { year, month, day } = await params
  const cssTip = loadContent('learning-css', year, month, day)

  if (!cssTip) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        {cssTip.metadata.title && (
          <h1 className="text-4xl font-bold mb-4">{cssTip.metadata.title}</h1>
        )}
        {cssTip.metadata.date && (
          <time className="text-muted-foreground text-sm block mb-8">
            {new Date(cssTip.metadata.date).toLocaleDateString('ja-JP')}
          </time>
        )}
        <div className="prose max-w-none">
          <MDXRemote
            source={cssTip.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeHighlight],
              },
            }}
          />
        </div>
      </article>
    </div>
  )
}
