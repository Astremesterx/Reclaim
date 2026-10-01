/** Hash routes keep refreshes and shared guide URLs inside a Pages project path. */
export function pagesHref(href: string) {
  return href.startsWith('/') && !href.startsWith('//') ? `#${href}` : href;
}
export function pagesRoute(hash: string) {
  return new URL(hash.startsWith('#/') ? hash.slice(1) : '/', 'https://reclaim.local');
}
