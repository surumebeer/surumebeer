import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LEARNING CSS",
}

interface CssTip {
  slug: string
  title: string
  date: string
  isPublished: boolean
  year: string
  month: string
  day: string
}

async function getCssTips(): Promise<CssTip[]> {
  const cssTipsDirectory = path.join(process.cwd(), 'content', 'learning-css')
  
  if (!fs.existsSync(cssTipsDirectory)) {
    return []
  }
  
  const cssTips: CssTip[] = []
  
  // 年フォルダを取得
  const years = fs.readdirSync(cssTipsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  for (const year of years) {
    const yearPath = path.join(cssTipsDirectory, year)
    
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
          
          cssTips.push({
            slug: `${year}/${month}/${day}`,
            title: data.title || 'Untitled',
            date: data.date || `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
            isPublished: data.isPublished !== false, // デフォルトはtrue
            year,
            month,
            day
          })
        } catch (error) {
          console.error(`Error reading file ${articlePath}:`, error)
        }
      }
    }
  }
  
  // 日付でソートして最新20件を取得
  return cssTips
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
}

export default async function CssTipsPage() {
  const cssTips = await getCssTips()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">LEARNING CSS</h1>
      
      {cssTips.length === 0 ? (
        <p className="text-muted-foreground">LEARNING CSSコンテンツがありません。</p>
      ) : (
        <div className="grid gap-4">
          {cssTips.map((cssTip) => (
            <Link 
              key={cssTip.slug}
              href={`/learning-css/${cssTip.slug}`} 
              className="block p-6 border rounded-lg hover:bg-accent transition-colors"
            >
              <h2 className="text-xl font-semibold mb-2">{cssTip.title}</h2>
              <time className="text-sm text-muted-foreground">
                {new Date(cssTip.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}