import './globals.css';
import type { Metadata } from 'next';
import MDXProviderWrapper from '@/components/MDXProviderWrapper';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'My Blog',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <MDXProviderWrapper>
          {children}
        </MDXProviderWrapper>
      </body>
    </html>
  );
}