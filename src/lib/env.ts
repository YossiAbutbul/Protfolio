export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/Portfolio" : "";

/**
 * Prefix a root-relative public asset path with the configured basePath so it
 * resolves correctly when the site is served from a subdirectory on GitHub Pages.
 * Accepts paths with or without a leading slash.
 */
export function withBasePath(path: string): string {
  if (!path) return BASE_PATH || "/";
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
