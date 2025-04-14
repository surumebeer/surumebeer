import Link from 'next/link';

export const Header = () => (
    <header className="bg-gray-100 shadow-md">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-blue-600">My Blog</h1>
            <ul className="flex gap-6">
                <li>
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/profile" className="hover:underline">
                        Profile
                    </Link>
                </li>
                <li>
                    <Link href="/css" className="hover:underline">
                        CSS Articles
                    </Link>
                </li>
            </ul>
        </nav>
    </header>
)