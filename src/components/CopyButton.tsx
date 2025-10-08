import React, { useState } from 'react';

type CopyButtonProps = {
  text: string;
  title?: string;
};

export default function CopyButton({ text, title }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // noop
    }
  };

  const getTooltipPosition = () => {
    if (!buttonRef) return { top: 0, left: 0 };
    
    const rect = buttonRef.getBoundingClientRect();
    return {
      top: rect.top - 10, // 10px above the button
      left: rect.left + rect.width / 2, // centered horizontally
    };
  };

  const position = getTooltipPosition();

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      style={{ overflow: 'visible' }}
    >
      <button
        ref={setButtonRef}
        onClick={handleCopy}
        aria-label={title || 'Copy to clipboard'}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          display: 'block',
          margin: '0 auto',
          transition: 'all 0.2s ease',
          transform: copied ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {copied ? (
          /* Checkmark icon when copied */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        ) : (
          /* Clipboard icon when not copied */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>
      
      {/* Custom tooltip matching homepage style */}
      {hovered && !copied && (
        <div 
          className="fixed z-[9999] bg-white text-gray-900 dark:bg-gray-900 dark:text-white text-sm rounded-lg shadow-lg px-4 py-3 pointer-events-none animate-fade-in" 
          style={{ 
            minWidth: '200px',
            maxWidth: '300px',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div>{copied ? 'Copied!' : `Copy: ${text}`}</div>
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
}


