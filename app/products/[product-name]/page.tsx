import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const productsDirectory = path.join(process.cwd(), 'content', 'products')
  
  if (!fs.existsSync(productsDirectory)) {
    return []
  }
  
  const params: { 'product-name': string }[] = []
  
  try {
    const productDirs = fs.readdirSync(productsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const productName of productDirs) {
      const articlePath = path.join(productsDirectory, productName, 'article.md')
      
      if (!fs.existsSync(articlePath)) {
        continue
      }
      
      try {
        const fileContent = fs.readFileSync(articlePath, 'utf8')
        const { data } = matter(fileContent)
        
        // 公開済みの商品のみ静的パラメータに含める
        if (data.isPublished !== false) {
          params.push({ 'product-name': productName })
        }
      } catch (error) {
        console.error(`Error reading file ${articlePath}:`, error)
      }
    }
  } catch (error) {
    console.error('Error generating static params for products:', error)
  }
  
  return params
}

interface PageProps {
  params: Promise<{
    'product-name': string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'product-name': productName } = await params
  const product = await getProductContent(productName)
  
  if (!product) {
    return {
      title: "商品が見つかりません"
    }
  }
  
  return {
    title: `${product.metadata.title || 'Untitled'} - ${product.metadata.date || ''}`
  }
}

async function getProductContent(productName: string) {
  const filePath = path.join(process.cwd(), 'content', 'products', productName, 'article.md')
  
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

export default async function ProductPage({ params }: PageProps) {
  const { 'product-name': productName } = await params
  const product = await getProductContent(productName)
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        {product.metadata.title && (
          <h1 className="text-4xl font-bold mb-4">{product.metadata.title}</h1>
        )}
        
        <div className="flex flex-wrap gap-4 items-center mb-8 text-sm text-muted-foreground">
          {product.metadata.date && (
            <time>
              {new Date(product.metadata.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
        </div>
        
        {product.metadata.image && (
          <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
            <Image
              src={product.metadata.image}
              alt={product.metadata.title || 'Product image'}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        {product.metadata.description && (
          <div className="text-lg text-muted-foreground mb-8 p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            {product.metadata.description}
          </div>
        )}
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: product.contentHtml }} 
        />
      </article>
    </div>
  )
}