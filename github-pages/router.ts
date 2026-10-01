import { useMemo, useSyncExternalStore } from 'react';
import { pagesRoute } from '../lib/pages-routing';

const subscribe = (listener: () => void) => {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
};
const snapshot = () => window.location.hash;
const navigation = {
  push(path: string) { window.location.hash = path; },
  replace(path: string) {
    window.history.replaceState(null, '', `#${path}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  },
  back() { window.history.back(); },
  forward() { window.history.forward(); },
  refresh() { window.location.reload(); },
  prefetch() { return Promise.resolve(); },
};
export function usePathname() {
  const value = useSyncExternalStore(subscribe, snapshot, () => '/');
  return pagesRoute(value).pathname;
}
export function useSearchParams() {
  const value = useSyncExternalStore(subscribe, snapshot, () => '/');
  return useMemo(() => pagesRoute(value).searchParams, [value]);
}
export function useRouter() { return navigation; }
