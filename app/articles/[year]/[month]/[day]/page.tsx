import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { TagList } from '../../../../components/tag-badge'

export const dynamicParams = false

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'content', 'articles')
  
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }
  
  const params: { year: string; month: string; day: string }[] = []
  
  try {
    const years = fs.readdirSync(articlesDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const year of years) {
      const yearPath = path.join(articlesDirectory, year)
      
      const months = fs.readdirSync(yearPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
      
      for (const month of months) {
        const monthPath = path.join(yearPath, month)
        
        const days = fs.readdirSync(monthPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)
        
        for (const day of days) {
          const dayPath = path.join(monthPath, day)
          const articlePath = path.join(dayPath, 'article.md')
          
          if (!fs.existsSync(articlePath)) {
            continue
          }
          
          try {
            const fileContent = fs.readFileSync(articlePath, 'utf8')
            const { data } = matter(fileContent)
            
            // 公開済みの記事のみ静的パラメータに含める
            if (data.isPublished === true) {
              params.push({ year, month, day })
            }
          } catch (error) {
            console.error(`Error reading file ${articlePath}:`, error)
          }
        }
      }
    }
  } catch (error) {
    console.error('Error generating static params for articles:', error)
  }
  
  // 静的エクスポートモードでは空配列を返せないため、フォールバック用のダミーパラメータを追加
  if (params.length === 0) {
    params.push({ year: '1970', month: '01', day: '01' })
  }
  
  return params
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
  const article = await getArticleContent(year, month, day)
  
  if (!article) {
    return {
      title: "記事が見つかりません"
    }
  }
  
  return {
    title: `${article.metadata.title || 'Untitled'} - ${article.metadata.date || `${year}-${month}-${day}`}`
  }
}

async function getArticleContent(year: string, month: string, day: string) {
  const filePath = path.join(process.cwd(), 'content', 'articles', year, month, day, 'article.md')
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(content)
    
    const contentHtml = processedContent.toString()
    
    // isPublishedがfalseの場合はnullを返す
    if (data.isPublished === false) {
      return null
    }
    
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