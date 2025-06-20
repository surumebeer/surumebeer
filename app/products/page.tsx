import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products",
}

interface Product {
  slug: string
  title: string
  image: string
  description: string
  date: string
  isPublished: boolean
}

async function getProducts(): Promise<Product[]> {
  const productsDirectory = path.join(process.cwd(), 'content', 'products')
  
  if (!fs.existsSync(productsDirectory)) {
    return []
  }
  
  const products: Product[] = []
  
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
        
        // isPublishedがfalseの場合はスキップ
        if (data.isPublished === false) {
          continue
        }
        
        products.push({
          slug: productName,
          title: data.title || 'Untitled',
          image: data.image || '',
          description: data.description || '',
          date: data.date || '',
          isPublished: data.isPublished !== false
        })
      } catch (error) {
        console.error(`Error reading file ${articlePath}:`, error)
      }
    }
  } catch (error) {
    console.error('Error reading products directory:', error)
  }
  
  // 日付でソート（新しい順）
  return products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      {products.length === 0 ? (
        <p className="text-muted-foreground">表示する商品がありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link 
              key={product.slug}
              href={`/products/${product.slug}`} 
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {product.image && (
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h2>
                  {product.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  {product.date && (
                    <time className="text-xs text-muted-foreground">
                      {new Date(product.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}