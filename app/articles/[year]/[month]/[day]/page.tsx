import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    year: string
    month: string
    day: string
  }>
}

async function getArticleContent(year: string, month: string, day: string) {
  const filePath = path.join(process.cwd(), 'articles', year, month, `${day}.md`)
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    const processedContent = await remark()
      .use(html)
      .process(content)
    
    const contentHtml = processedContent.toString()
    
    return {
      metadata: data,
      contentHtml,
    }
  } catch {
    return null
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { year, month, day } = await params
  const article = await getArticleContent(year, month, day)
  
  if (!article) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        {article.metadata.title && (
          <h1 className="text-4xl font-bold mb-4">{article.metadata.title}</h1>
        )}
        {article.metadata.date && (
          <time className="text-muted-foreground text-sm block mb-8">
            {new Date(article.metadata.date).toLocaleDateString('ja-JP')}
          </time>
        )}
        <div 
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }} 
        />
      </article>
    </div>
  )
}