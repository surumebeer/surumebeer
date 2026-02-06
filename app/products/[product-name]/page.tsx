import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getFlatStaticParams, loadContentWithHtml } from '@/lib/content/loader'

export const dynamicParams = false

export function generateStaticParams() {
  return getFlatStaticParams('products', 'product-name', 'no-products')
}

interface PageProps {
  params: Promise<{
    'product-name': string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { 'product-name': productName } = await params
  const product = await loadContentWithHtml('products', productName)

  if (!product) {
    return { title: "商品が見つかりません" }
  }

  return {
    title: `${product.metadata.title || 'Untitled'} - ${product.metadata.date || ''}`
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { 'product-name': productName } = await params
  const product = await loadContentWithHtml('products', productName)

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
