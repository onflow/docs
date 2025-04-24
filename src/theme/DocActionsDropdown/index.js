import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function DocActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const getDocusaurusUrl = () => {
    const currentPath = window.location.pathname;
    const docsPath = currentPath.replace('/docs/', '');
    return `https://github.com/onflow/docs/tree/main/docs/${docsPath}.md`;
  };

  const getRawMarkdownUrl = () => {
    const currentPath = window.location.pathname;
    const docsPath = currentPath.replace('/docs/', '');
    return `https://raw.githubusercontent.com/onflow/docs/main/docs/${docsPath}.md`;
  };

  const handleCopyMarkdown = async () => {
    try {
      const rawUrl = getRawMarkdownUrl();
      const response = await fetch(rawUrl);
      const markdown = await response.text();
      navigator.clipboard.writeText(markdown);
      setIsOpen(false);
    } catch (error) {
      console.error('Error fetching markdown:', error);
      // Fallback to the GitHub URL if raw fetch fails
      window.open(getDocusaurusUrl(), '_blank');
    }
  };

  const handleViewMarkdown = () => {
    const rawUrl = getRawMarkdownUrl();
    window.open(rawUrl, '_blank');
    setIsOpen(false);
  };

  const handleOpenInChatGPT = () => {
    const docusaurusUrl = getDocusaurusUrl();
    const prompt = `Analyze this documentation: ${docusaurusUrl}. After reading, ask me what I'd like to know. Keep responses focused on the content.`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`https://chatgpt.com/?hints=search&q=${encodedPrompt}`, '_blank');
    setIsOpen(false);
  };

  const handleOpenInClaude = () => {
    const docusaurusUrl = getDocusaurusUrl();
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