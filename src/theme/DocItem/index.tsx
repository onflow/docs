import React from 'react';
import DocItem from '@theme-original/DocItem';
import DocActionsDropdown from '../DocActionsDropdown';
import type { Props } from '@theme/DocItem';

export default function DocItemWrapper(props: Props): JSX.Element {
  return (
    <div className="doc-item-wrapper">
      <div className="doc-actions-container">
        <DocActionsDropdown />
      </div>
      <DocItem {...props} />
    </div>
  );
} 