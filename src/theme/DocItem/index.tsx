import React from 'react';
import DocItem from '@theme-original/DocItem';
import type { Props } from '@theme/DocItem';

export default function DocItemWrapper(props: Props): JSX.Element {
  return (
    <div className="doc-item-wrapper">
      <div className="doc-actions-container">
      </div>
      <DocItem {...props} />
    </div>
  );
} 