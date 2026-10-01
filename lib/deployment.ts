declare const __RECLAIM_GITHUB_PAGES__: boolean | undefined;

export const GITHUB_PAGES = typeof __RECLAIM_GITHUB_PAGES__ !== 'undefined'
  && __RECLAIM_GITHUB_PAGES__ === true;
export const SOURCE_REPOSITORY = 'https://github.com/Astremesterx/Reclaim';
