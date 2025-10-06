import React from 'react';

interface PlaygroundButtonProps {
  href: string;
  text?: string;
}

export default function PlaygroundButton({
  href,
  text = 'Open in Playground',
}: PlaygroundButtonProps): React.ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: '0.5rem 1rem',
        background: '#00ef8b',
        color: '#000',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '0.875rem',
        fontWeight: '600',
      }}
    >
      {text} →
    </a>
  );
}
