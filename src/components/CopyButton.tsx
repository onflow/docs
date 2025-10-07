import React, { useState } from 'react';

type CopyButtonProps = {
  text: string;
  title?: string;
};

export default function CopyButton({ text, title }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // noop
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={title || 'Copy to clipboard'}
      title={copied ? 'Copied!' : `Copy: ${text}`}
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
  );
}


