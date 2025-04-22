import React, { Fragment, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faCode,
  faRobot,
  faBrain,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import styles from './PageActionsDropdown.module.css';

export default function PageActionsDropdown(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  // Get the current path and create the markdown URL
  const currentPath = window.location.pathname;
  // Remove any trailing slash to match our directory structure
  const cleanPath = currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;
  // If we're at the root docs page (/docs), use /index.md
  const mdPath =
    cleanPath === '/docs' ? '/index' : cleanPath.replace('/docs', '');
  const markdownUrl = `/markdown${mdPath}.md`;

  // Create the ChatGPT and Claude URLs with the markdown URL
  const fullUrl = `${window.location.origin}${markdownUrl}`;
  const chatGptUrl = `https://chat.openai.com/?hints=search&q=Read%20from%20${encodeURIComponent(
    fullUrl,
  )}%20so%20I%20can%20ask%20questions%20about%20it.`;
  const claudeUrl = `https://claude.ai/new?q=Read%20from%20${encodeURIComponent(
    fullUrl,
  )}%20so%20I%20can%20ask%20questions%20about%20it.`;

  const handleCopyMarkdown = async (): Promise<void> => {
    try {
      // Fetch the actual Markdown file
      const response = await fetch(markdownUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch Markdown: ${response.status}`);
      }

      const markdown = await response.text();
      await navigator.clipboard.writeText(markdown);

      setCopyStatus('Copied Markdown to clipboard!');
      setTimeout(() => setCopyStatus(''), 2000);
      setIsOpen(false); // Close the dropdown after copying
    } catch (err) {
      console.error('Failed to copy markdown:', err);

      // Fallback to copying the article text if fetch fails
      try {
        const pageContent = document.querySelector('article')?.innerText ?? '';
        await navigator.clipboard.writeText(pageContent);
        setCopyStatus('Copied page content (fallback)');
        setTimeout(() => setCopyStatus(''), 2000);
        setIsOpen(false);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        setCopyStatus('Failed to copy');
        setTimeout(() => setCopyStatus(''), 2000);
      }
    }
  };

  // Reference to track button position for the portal
  const [buttonPosition, setButtonPosition] = React.useState({
    top: 0,
    right: 0,
  });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Update position when the button is clicked
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
  };

  // Toggle the dropdown
  const toggleDropdown = () => {
    updatePosition();
    setIsOpen(!isOpen);
  };

  // Handle clicks outside to close the dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(`.${styles.menuItems}`)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.menuContainer}>
      <div style={{ position: 'relative' }}>
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className={styles.menuButton}
        >
          <span>Copy page</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={styles.chevronIcon}
          />
        </button>

        {copyStatus && (
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              zIndex: 10000,
              whiteSpace: 'nowrap',
            }}
          >
            {copyStatus}
          </div>
        )}
      </div>

      {isOpen &&
        createPortal(
          <div
            className={styles.menuItems}
            style={{
              position: 'absolute',
              top: `${buttonPosition.top}px`,
              right: `${buttonPosition.right}px`,
              zIndex: 9999, // Very high z-index
            }}
          >
            <div className={styles.menuItemsContainer}>
              <button onClick={handleCopyMarkdown} className={styles.menuItem}>
                <FontAwesomeIcon icon={faCopy} className={styles.menuIcon} />
                <div>
                  <div className={styles.menuItemTitle}>Copy page</div>
                  <div className={styles.menuItemDescription}>
                    Copy page as Markdown for LLMs
                  </div>
                </div>
              </button>

              <a
                href={markdownUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faCode} className={styles.menuIcon} />
                <div>
                  <div className={styles.menuItemTitle}>View as Markdown</div>
                  <div className={styles.menuItemDescription}>
                    View this page as plain text
                  </div>
                </div>
              </a>

              <a
                href={chatGptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faRobot} className={styles.menuIcon} />
                <div>
                  <div className={styles.menuItemTitle}>Open in ChatGPT</div>
                  <div className={styles.menuItemDescription}>
                    Ask questions about this page
                  </div>
                </div>
              </a>

              <a
                href={claudeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faBrain} className={styles.menuIcon} />
                <div>
                  <div className={styles.menuItemTitle}>Open in Claude</div>
                  <div className={styles.menuItemDescription}>
                    Ask questions about this page
                  </div>
                </div>
              </a>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
