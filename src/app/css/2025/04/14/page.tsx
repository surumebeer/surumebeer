'use client';

import Article from './article.mdx';
import {CssComponent} from './css';

export default function ArticlePage() {
  return (
    <div className="p-8">
      <Article />
      <CssComponent />
    </div>
  );
}