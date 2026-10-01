import React from 'react';
import { createRoot } from 'react-dom/client';
import ReclaimApp from '../app/reclaim-app';
import { AppProvider } from '../app/provider';
import '../app/globals.css';

// In-page anchors must not replace the hash used for application navigation.
document.addEventListener('click', event => {
  if (!(event.target instanceof Element) || event.defaultPrevented || event.button !== 0
    || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const anchor = event.target.closest('a');
  const href = anchor?.getAttribute('href');
  if (!href?.startsWith('#') || href.startsWith('#/')) return;
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView();
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

class PageError extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <main className="container page-content">
      <h1>Let’s get you back on track.</h1>
      <p>This page could not open. Reload to try again. Exported plans remain in your files.</p>
      <button className="btn primary" onClick={() => window.location.reload()}>Reload RECLAIM</button>
    </main> : this.props.children;
  }
}
createRoot(document.getElementById('root')!).render(
  <PageError><AppProvider><ReclaimApp /></AppProvider></PageError>,
);
