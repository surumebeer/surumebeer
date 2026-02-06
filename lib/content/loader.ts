import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  ContentFrontmatter,
  DateParts,
  DateBasedEntry,
  ArticleEntry,
  ProductEntry,
  ContentResult,
  ContentWithHtml,
} from './types'
import { markdownToHtml } from './markdown'

const contentRoot = path.join(process.cwd(), 'content')

// --- 内部ヘルパー ---

function getDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return []
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function readFrontmatter(filePath: string): ContentFrontmatter | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContent)
    return data as ContentFrontmatter
  } catch {
    return null
  }
}

// --- YYYY/MM/DD ディレクトリ走査 ---

interface DateDirEntry {
  year: string
  month: string
  day: string
  filePath: string
}

function traverseDateDirectories(section: string): DateDirEntry[] {
  const sectionDir = path.join(contentRoot, section)
  const entries: DateDirEntry[] = []

  for (const year of getDirectories(sectionDir)) {
    const yearPath = path.join(sectionDir, year)
    for (const month of getDirectories(yearPath)) {
      const monthPath = path.join(yearPath, month)
      for (const day of getDirectories(monthPath)) {
        const filePath = path.join(monthPath, day, 'article.md')
        if (fs.existsSync(filePath)) {
          entries.push({ year, month, day, filePath })
        }
      }
    }
  }

  return entries
}

// --- 公開済み一覧の取得 ---

export function getArticles(): ArticleEntry[] {
  const entries = traverseDateDirectories('articles')
  const articles: ArticleEntry[] = []

  for (const { year, month, day, filePath } of entries) {
    const data = readFrontmatter(filePath)
    if (!data || data.isPublished === false) continue

    articles.push({
      slug: `${year}/${month}/${day}`,
      title: data.title ?? 'Untitled',
      date: data.date ?? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      isPublished: true,
      year,
      month,
      day,
      tags: data.tags ?? [],
    })
  }

  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
}

export function getCssTips(): DateBasedEntry[] {
  const entries = traverseDateDirectories('learning-css')
  const tips: DateBasedEntry[] = []

  for (const { year, month, day, filePath } of entries) {
    const data = readFrontmatter(filePath)
    if (!data || data.isPublished === false) continue

    tips.push({
      slug: `${year}/${month}/${day}`,
      title: data.title ?? 'Untitled',
      date: data.date ?? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      isPublished: true,
      year,
      month,
      day,
    })
  }

  return tips
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
}

export function getProducts(): ProductEntry[] {
  const productsDir = path.join(contentRoot, 'products')
  const products: ProductEntry[] = []

  for (const name of getDirectories(productsDir)) {
    const filePath = path.join(productsDir, name, 'article.md')
    if (!fs.existsSync(filePath)) continue

    const data = readFrontmatter(filePath)
    if (!data || data.isPublished === false) continue

    products.push({
      slug: name,
      title: data.title ?? 'Untitled',
      image: data.image ?? '',
      description: data.description ?? '',
      date: data.date ?? '',
      isPublished: true,
    })
  }

  return products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// --- generateStaticParams 用 ---

export function getDateBasedStaticParams(section: string, fallback: DateParts): DateParts[] {
  const entries = traverseDateDirectories(section)
  const params: DateParts[] = []

  for (const { year, month, day, filePath } of entries) {
    const data = readFrontmatter(filePath)
    if (data?.isPublished === true) {
      params.push({ year, month, day })
    }
  }

  if (params.length === 0) {
    params.push(fallback)
  }

  return params
}

export function getFlatStaticParams(section: string, paramKey: string, fallbackValue: string): Array<Record<string, string>> {
  const sectionDir = path.join(contentRoot, section)
  const params: Array<Record<string, string>> = []

  for (const name of getDirectories(sectionDir)) {
    const filePath = path.join(sectionDir, name, 'article.md')
    if (!fs.existsSync(filePath)) continue

    const data = readFrontmatter(filePath)
    if (data?.isPublished === true) {
      params.push({ [paramKey]: name })
    }
  }

  if (params.length === 0) {
    params.push({ [paramKey]: fallbackValue })
  }

  return params
}

// --- 詳細ページ用: 単一コンテンツの読み込み ---

export function loadContent(section: string, ...pathSegments: string[]): ContentResult | null {
  const filePath = path.join(contentRoot, section, ...pathSegments, 'article.md')

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    const metadata = data as ContentFrontmatter

    if (metadata.isPublished === false) {
      return null
    }

    return { metadata, content }
  } catch {
    return null
  }
}

export async function loadContentWithHtml(section: string, ...pathSegments: string[]): Promise<ContentWithHtml | null> {
  const result = loadContent(section, ...pathSegments)
  if (!result) return null

  const contentHtml = await markdownToHtml(result.content)
  return { metadata: result.metadata, contentHtml }
}
