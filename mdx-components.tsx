import type { MDXComponents } from "mdx/types";

/**
 * Custom component map applied to all MDX content. Plain-HTML elements get a
 * subtle editorial polish; everything else passes through.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
