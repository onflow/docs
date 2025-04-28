import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function DocActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset copy success message after a delay
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

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
        await navigator.clipboard.writeText(result.text);
        setCopySuccess(true);
        // Only close dropdown if it's open and user clicked on menu item
        if (isOpen) {
          setIsOpen(false);
        }
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

  const handleOpenInChatGPT = async () => {
    try {
      const path = window.location.pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '');
      const result = await fetchMarkdown(path);
      
      if (result) {
        const prompt = `Analyze this documentation: ${result.url}. After reading, ask me what I'd like to know. Keep responses focused on the content.`;
        const encodedPrompt = encodeURIComponent(prompt);
        window.open(`https://chatgpt.com/?q=${encodedPrompt}`, '_blank');
      } else {
        // Fallback to current URL
        const currentUrl = window.location.href;
        const prompt = `Analyze this documentation: ${currentUrl}. After reading, ask me what I'd like to know. Keep responses focused on the content.`;
        const encodedPrompt = encodeURIComponent(prompt);
        window.open(`https://chatgpt.com/?q=${encodedPrompt}`, '_blank');
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error opening in ChatGPT:', error);
      // Fallback to current URL
      const currentUrl = window.location.href;
      const prompt = `Analyze this documentation: ${currentUrl}. After reading, ask me what I'd like to know. Keep responses focused on the content.`;
      const encodedPrompt = encodeURIComponent(prompt);
      window.open(`https://chatgpt.com/?q=${encodedPrompt}`, '_blank');
      setIsOpen(false);
    }
  };

  const handleOpenInClaude = async () => {
    try {
      const path = window.location.pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '');
      const result = await fetchMarkdown(path);
      
      if (result) {
        const prompt = `Review this documentation: ${result.url}. Once complete, ask me what questions I have. Stay focused on the provided content.`;
        const encodedPrompt = encodeURIComponent(prompt);
        window.open(`https://claude.ai/chat/new?prompt=${encodedPrompt}`, '_blank');
      } else {
        // Fallback to current URL
        const currentUrl = window.location.href;
        const prompt = `Review this documentation: ${currentUrl}. Once complete, ask me what questions I have. Stay focused on the provided content.`;
        const encodedPrompt = encodeURIComponent(prompt);
        window.open(`https://claude.ai/chat/new?prompt=${encodedPrompt}`, '_blank');
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error opening in Claude:', error);
      // Fallback to current URL
      const currentUrl = window.location.href;
      const prompt = `Review this documentation: ${currentUrl}. Once complete, ask me what questions I have. Stay focused on the provided content.`;
      const encodedPrompt = encodeURIComponent(prompt);
      window.open(`https://claude.ai/chat/new?prompt=${encodedPrompt}`, '_blank');
      setIsOpen(false);
    }
  };

  const handleOpenFlowKnowledge = () => {
    window.open('https://github.com/onflow/Flow-Data-Sources/tree/main/merged_docs', '_blank');
    setIsOpen(false);
  };

  const handleArrowClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        const container = document.querySelector(`.${styles.dropdownContainer}`);
        if (container && !container.contains(event.target)) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen, styles.dropdownContainer]);

  return (
    <div className={styles.dropdownContainer}>
      <button
        className={clsx(styles.dropdownButton, {
          [styles.copySuccess]: copySuccess
        })}
        onClick={handleCopyMarkdown}
        aria-expanded={isOpen}
        title="Copy as Markdown"
      >
        {copySuccess ? 'Copied!' : 'Copy as Markdown'}
        <span className={styles.arrow} onClick={handleArrowClick} title="Show more options" />
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.menuItemWithDescription}>
            <button onClick={handleCopyMarkdown} className={styles.menuItem}>
              <span className={styles.menuItemTitle}>Copy as Markdown</span>
              <span className={styles.menuItemDescription}>Copy the page content as markdown</span>
            </button>
          </div>
          <div className={styles.menuItemWithDescription}>
            <button onClick={handleOpenInChatGPT} className={styles.menuItem}>
              <span className={styles.menuItemTitle}>Open in ChatGPT</span>
              <span className={styles.menuItemDescription}>Ask GPT about this content</span>
            </button>
          </div>
          <div className={styles.menuItemWithDescription}>
            <button onClick={handleOpenInClaude} className={styles.menuItem}>
              <span className={styles.menuItemTitle}>Open in Claude</span>
              <span className={styles.menuItemDescription}>Ask Claude about this content</span>
            </button>
          </div>
          <div className={styles.divider} />
          <div className={styles.menuItemWithDescription}>
            <button onClick={handleViewMarkdown} className={styles.menuItem}>
              <span className={styles.menuItemTitle}>View Source Markdown</span>
              <span className={styles.menuItemDescription}>See the raw markdown file</span>
            </button>
          </div>
          <div className={styles.divider} />
          <div className={styles.menuItemWithDescription}>
            <button onClick={handleOpenFlowKnowledge} className={styles.menuItem}>
              <span className={styles.menuItemTitle}>Full Flow Knowledge Source</span>
              <span className={styles.menuItemDescription}>Integrate all Flow documentation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 