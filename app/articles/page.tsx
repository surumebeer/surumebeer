import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from "next/link"
import type { Metadata } from "next"
import { TagList } from '../components/tag-badge'

export const metadata: Metadata = {
  title: "Articles",
}

interface Article {
  slug: string
  title: string
  date: string
  isPublished: boolean
  year: string
  month: string
  day: string
  tags?: string[]
}

async function getArticles(): Promise<Article[]> {
  const articlesDirectory = path.join(process.cwd(), 'content', 'articles')
  
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }
  
  const articles: Article[] = []
  
  // 年フォルダを取得
  const years = fs.readdirSync(articlesDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  for (const year of years) {
    const yearPath = path.join(articlesDirectory, year)
    
    // 月フォルダを取得
    const months = fs.readdirSync(yearPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const month of months) {
      const monthPath = path.join(yearPath, month)
      
      // 日フォルダを取得
      const days = fs.readdirSync(monthPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
      
      for (const day of days) {
        const dayPath = path.join(monthPath, day)
        const articlePath = path.join(dayPath, 'article.md')
        
        // article.mdファイルが存在するかチェック
        if (!fs.existsSync(articlePath)) {
          continue
        }
        
        try {
          const fileContent = fs.readFileSync(articlePath, 'utf8')
          const { data } = matter(fileContent)
          
          // isPublishedがfalseの場合はスキップ
          if (data.isPublished === false) {
            continue
          }
          
          articles.push({
            slug: `${year}/${month}/${day}`,
            title: data.title || 'Untitled',
            date: data.date || `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
            isPublished: data.isPublished !== false, // デフォルトはtrue
            year,
            month,
            day,
            tags: data.tags || []
          })
        } catch (error) {
          console.error(`Error reading file ${articlePath}:`, error)
        }
      }
    }
  }
  
  // 日付でソートして最新20件を取得
  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
}

export default async function ArticlesPage() {
  const articles = await getArticles()
  
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