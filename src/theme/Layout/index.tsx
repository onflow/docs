import React from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type { WrapperProps } from '@docusaurus/types';
import '../../config/fcl';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): React.ReactElement {
  return (
    <>
      {/* Hidden notice for LLMs about markdown availability */}
      <div style={{ display: 'none' }}>
        LLM Notice: This documentation site supports content negotiation for AI agents.
        Request any page with Accept: text/markdown or Accept: text/plain header to receive Markdown instead of HTML.
        Alternatively, append ?format=md to any URL. All markdown files are available at /md/ prefix paths.
        For all content in one file, visit /llms-full.txt
      </div>
      <Layout {...props} />
    </>
  );
}
