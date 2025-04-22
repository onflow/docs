import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function DocActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyMarkdown = () => {
    const content = document.querySelector('article').innerText;
    navigator.clipboard.writeText(content);
    setIsOpen(false);
  };

  const handleViewMarkdown = () => {
    const content = document.querySelector('article').innerText;
    // Convert content to proper markdown format
    const markdownContent = `# ${document.querySelector('h1').innerText}\n\n${content}`;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleOpenInChatGPT = () => {
    const currentUrl = window.location.href;
    const prompt = `Analyze this documentation: ${currentUrl}. After reading, ask me what I'd like to know. Keep responses focused on the content.`;
    const encodedPrompt = encodeURIComponent(prompt);
    window.open(`https://chatgpt.com/?hints=search&q=${encodedPrompt}`, '_blank');
    setIsOpen(false);
  };

  const handleOpenInClaude = () => {
    const currentUrl = window.location.href;
    const prompt = `Review this documentation: ${currentUrl}. Once complete, ask me what questions I have. Stay focused on the provided content.`;
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
            View as Markdown
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