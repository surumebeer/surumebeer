import Link from "next/link"

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
      <div className="grid gap-4">
        <Link 
          href="/articles/2025/06/20" 
          className="block p-4 border rounded-lg hover:bg-accent transition-colors"
        >
          <h2 className="text-xl font-semibold">テスト記事</h2>
          <time className="text-sm text-muted-foreground">2025年6月20日</time>
        </Link>
      </div>
    </div>
  )
}