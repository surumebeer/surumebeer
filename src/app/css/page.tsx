import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';

type Post = {
  slug: string;        // 例: '2025/04/15'
  title: string;       // frontmatter から取得
};

function getAllPosts(): Post[] {
  const basePath = path.join(process.cwd(), 'src/app/css');
  const posts: Post[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'article.mdx') {
        const relativePath = path.relative(basePath, fullPath);
        const slug = relativePath.replace(/\/article\.mdx$/, '');

        // frontmatterからtitleを取得
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data } = matter(raw);
        const title = data.title ?? slug;

        posts.push({ slug, title });
      }
    }
  }

  walk(basePath);

  // slugを日付順に降順ソート（新しい順）
  return posts.sort((a, b) => (a.slug < b.slug ? 1 : -1));
}

export default function CssIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">CSS記事一覧</h1>
      <ul className="list-disc pl-4">
        {posts.map(({ slug, title }) => (
          <li key={slug}>
            <Link href={`/css/${slug}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}