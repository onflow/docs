import React, { useState } from 'react';

interface TooltipProps {
  description: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ description, children }) => {
  const [hovered, setHovered] = useState(false);

  // Try to extract the title from the children (the link text)
  let title = '';
  if (children && typeof children === 'object' && 'props' in children && children.props.children) {
    // If the link has a span for the label, use its text
    const childArray = React.Children.toArray(children.props.children);
    const labelSpan = childArray.find(
      (el) => typeof el === 'object' && el && 'props' in el && el.props.className && el.props.className.includes('font-medium')
    );
    if (labelSpan && typeof labelSpan === 'object' && 'props' in labelSpan) {
      title = labelSpan.props.children;
    } else {
      // Fallback: use all children as string
      title = children.props.children;
    }
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
    >
      {children}
      {hovered && description && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2.5 w-64 bg-white text-gray-900 dark:bg-gray-900 dark:text-white text-sm rounded-lg shadow-lg px-4 py-3 pointer-events-none animate-fade-in" style={{ minWidth: '200px' }}>
          <div className="font-bold mb-1">{title}</div>
          <div>{description}</div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px]">
            {/* Triangle for light mode */}
            <div
              className="w-0 h-0 block dark:hidden"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #fff',
              }}
            />
            {/* Triangle for dark mode */}
            <div
              className="w-0 h-0 hidden dark:block"
              style={{
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #18181b', // Tailwind's bg-gray-900
              }}
            />
          </div>
        </div>
      )}
    </span>
  );
};

export default Tooltip; 