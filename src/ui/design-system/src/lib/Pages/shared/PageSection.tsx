import React from 'react';
import clsx from 'clsx';

export interface PageSectionProps {
  className?: string;
  children?: React.ReactNode;
  sectionId?: string;
}

export default function PageSection({
  className,
  children,
  sectionId = '', // used for allowing links to scroll to section if `#{sectionId}` is in url
}: PageSectionProps): React.ReactNode {
  return (
    <div id={sectionId} className={clsx('py-16', className)}>
      {children}
    </div>
  );
}
