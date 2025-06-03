import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import type { Props } from '@theme/TOC';
import DocActionsDropdown from '../DocActionsDropdown';

import styles from './styles.module.css';
import FeedbackFaces from '@site/src/components/feedbackFaces';

// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({ className, ...props }: Props): JSX.Element {
  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <div className="p-1">
        <h6 className="mb-0 p-1">Rate this page</h6>
        <FeedbackFaces />
        <div className={styles.docActionsContainer}>
          <DocActionsDropdown />
        </div>
      </div>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
    </div>
  );
}
