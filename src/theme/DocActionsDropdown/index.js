import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function DocActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const buildRawUrl = (path, isIndex) => {
    if (isIndex) {
      // For index files, use path/index.md
      return `https://raw.githubusercontent.com/onflow/docs/main/docs/${path}/index.md`;
    } else {
      // For regular files, use path.md
      return `https://raw.githubusercontent.com/onflow/docs/main/docs/${path}.md`;
    }
  };

  const fetchMarkdown = async (path) => {
    // First, try to determine if this is an index.md file by checking both paths
    const directPath = `https://raw.githubusercontent.com/onflow/docs/main/docs/${path}.md`;
    const indexPath = `https://raw.githubusercontent.com/onflow/docs/main/docs/${path}/index.md`;
    
    try {
      // Try the index path first
      const indexResponse = await fetch(indexPath);
      if (indexResponse.ok) {
        return { url: indexPath, text: await indexResponse.text() };
      }
      
      // If index path fails, try the direct path
      const directResponse = await fetch(directPath);
      if (directResponse.ok) {
        return { url: directPath, text: await directResponse.text() };
      }
      
      // If both fail, return null
      return null;
    } catch (error) {
      console.error('Error fetching markdown:', error);
      return null;
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      const path = window.location.pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '');
      const result = await fetchMarkdown(path);
      
      if (result) {
        navigator.clipboard.writeText(result.text);
        setIsOpen(false);
      } else {
        throw new Error('Could not fetch markdown');
      }
    } catch (error) {
      console.error('Error copying markdown:', error);
      // Fallback to GitHub
      const currentPath = window.location.pathname.replace(/^\/docs\/?/, '');
      window.open(`https://github.com/onflow/docs/tree/main/docs/${currentPath}`, '_blank');
    }
  };

  const handleViewMarkdown = async () => {
    try {
      const path = window.location.pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '');
      const result = await fetchMarkdown(path);
      
      if (result) {
        window.open(result.url, '_blank');
        setIsOpen(false);
      } else {
        // Fallback to GitHub
        const currentPath = window.location.pathname.replace(/^\/docs\/?/, '');
        window.open(`https://github.com/onflow/docs/tree/main/docs/${currentPath}`, '_blank');
      }
    } catch (error) {
      console.error('Error viewing markdown:', error);
      // Fallback to GitHub
      const currentPath = window.location.pathname.replace(/^\/docs\/?/, '');
      window.open(`https://github.com/onflow/docs/tree/main/docs/${currentPath}`, '_blank');
    }
  };

  const handleOpenInChatGPT = () => {
    const currentPath = window.location.pathname.replace(/^\/docs\/?/, '');
    const docusaurusUrl = `https://github.com/onflow/docs/tree/main/docs/${currentPath}`;
    const prompt = `Analyze this documentation: ${docusaurusUrl}. After reading, ask me what I'd like to know. Keep responses focused on the content.`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`https://chatgpt.com/?hints=search&q=${encodedPrompt}`, '_blank');
    setIsOpen(false);
  };

  const handleOpenInClaude = () => {
    const currentPath = window.location.pathname.replace(/^\/docs\/?/, '');
    const docusaurusUrl = `https://github.com/onflow/docs/tree/main/docs/${currentPath}`;
    const prompt = `Review this documentation: ${docusaurusUrl}. Once complete, ask me what questions I have. Stay focused on the provided content.`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`https://claude.ai/chat/new?prompt=${encodedPrompt}`, '_blank');
    setIsOpen(false);
  };

  const handleOpenFlowKnowledge = () => {
    window.open('https://github.com/onflow/Flow-Data-Sources/tree/main/merged_docs', '_blank');
    setIsOpen(false);
  };

  const handleArrowClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdownContainer}>
      <button
        className={styles.dropdownButton}
        onClick={handleOpenInChatGPT}
      >
        Open in ChatGPT
        <span className={styles.arrow} onClick={handleArrowClick} />
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button onClick={handleOpenInClaude} className={styles.menuItem}>
            Open in Claude
          </button>
          <div className={styles.divider} />
          <button onClick={handleCopyMarkdown} className={styles.menuItem}>
            Copy as Markdown
          </button>
          <button onClick={handleViewMarkdown} className={styles.menuItem}>
            View Source Markdown
          </button>
          <div className={styles.divider} />
          <button onClick={handleOpenFlowKnowledge} className={styles.menuItem}>
            Full Flow Knowledge Source
          </button>
        </div>
      )}
    </div>
  );
} 