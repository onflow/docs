import React from 'react';
import clsx from 'clsx';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';

export type RemovableTagProps = {
  name: string;
  onRemove: () => void;
  className?: string;
};

const RemovableTag: React.FC<RemovableTagProps> = ({ name, onRemove, className }) => (
  <Button
    size="sm"
    variant="primary-no-darkmode"
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
      className
    )}
    onClick={onRemove}
  >
    {name} <span className="ml-2">&times;</span>
  </Button>
);

export default RemovableTag;
