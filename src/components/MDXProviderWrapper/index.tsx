'use client';

import { MDXProvider } from '@mdx-js/react';
import { useMDXComponents } from '@/lib/mdx-components';

export default function MDXProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MDXProvider components={useMDXComponents({})}>{children}</MDXProvider>;
}