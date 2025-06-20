import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">商品が見つかりません</h1>
      <p className="text-muted-foreground mb-8">
        指定された商品は存在しないか、現在公開されていません。
      </p>
      <Link 
        href="/products" 
        className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        商品一覧に戻る
      </Link>
    </div>
  )
}