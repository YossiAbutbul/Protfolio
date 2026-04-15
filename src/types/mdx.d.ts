import type { MDXProps } from "mdx/types";

declare module "*.mdx" {
  export default function MDXContent(props: MDXProps): JSX.Element;
}

declare module "@content/projects/report-generator.mdx" {
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}

declare module "@content/projects/pipeline-cpu.mdx" {
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}

declare module "@content/projects/two-pass-assembler.mdx" {
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}

declare module "@content/projects/oplanner.mdx" {
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}

declare module "@content/projects/mini-circuits-power-sensor.mdx" {
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}
