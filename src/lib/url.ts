/**
 * base path (`/surumebeer`) を考慮した絶対パスを組み立てる。
 * `import.meta.env.BASE_URL` は Astro が base 設定から生成する。
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
