import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { pagesHref } from '../lib/pages-routing';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
};
const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, prefetch: _prefetch, replace, onClick, ...props }, ref,
) {
  const internal = href.startsWith('/') && !href.startsWith('//');
  return <a {...props} ref={ref} href={pagesHref(href)} onClick={event => {
    onClick?.(event);
    if (!internal || !replace || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    window.history.replaceState(null, '', `#${href}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }} />;
});
export default Link;
