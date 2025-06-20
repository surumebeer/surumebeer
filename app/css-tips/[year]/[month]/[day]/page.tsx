import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'

interface PageProps {
  params: Promise<{
    year: string
    month: string
    day: string
  }>
}

// MDXで使用可能なカスタムコンポーネント
const components = {
  // カスタムコンポーネントの例
  CodeDemo: ({ children, ...props }: { children: React.ReactNode }) => (
    <div className="border border-border rounded-lg p-4 bg-muted/30 my-4" {...props}>
      <div className="mb-2 text-sm font-medium text-muted-foreground">Demo:</div>
      <div className="bg-background p-4 rounded border">
        {children}
      </div>
    </div>
  ),
  
  ColorBox: ({ color, name }: { color: string; name: string }) => (
    <div className="inline-flex items-center gap-2 p-2 border rounded-lg bg-background">
      <div 
        className="w-8 h-8 rounded border" 
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{color}</div>
      </div>
    </div>
  ),
  
  CSSProperty: ({ property, value, description }: { 
    property: string; 
    value: string; 
    description?: string 
  }) => (
    <div className="border border-border rounded-lg p-4 my-4">
      <div className="font-mono text-sm mb-2">
        <span className="text-blue-600 dark:text-blue-400">{property}</span>
        <span className="text-muted-foreground">: </span>
        <span className="text-green-600 dark:text-green-400">{value}</span>
        <span className="text-muted-foreground">;</span>
      </div>
      {description && (
        <div className="text-sm text-muted-foreground">{description}</div>
      )}
    </div>
  ),
}

async function getCssTipContent(year: string, month: string, day: string) {
  const filePath = path.join(process.cwd(), 'css-tips', year, month, day, 'article.md')
  
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    // isPublishedがfalseの場合はnullを返す
    if (data.isPublished === false) {
      return null
    }
    
    return {
      metadata: data,
      content,
    }
  } catch {
    return null
  }
}

export default async function CssTipPage({ params }: PageProps) {
  const { year, month, day } = await params
  const cssTip = await getCssTipContent(year, month, day)
  
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
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>
      </article>
    </div>
  )
}