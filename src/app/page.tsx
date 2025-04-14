import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">ようこそ</h1>
      <ul className="mt-4 list-disc pl-4">
        <li><Link href="/profile">プロフィール</Link></li>
        <li><Link href="/css">CSS記事一覧</Link></li>
      </ul>
    </main>
  );
}