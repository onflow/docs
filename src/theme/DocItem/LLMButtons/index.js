import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';

export default function LLMButtons({ content }) {
  const handleCopyMarkdown = async () => {
    try {
      // Get the current page content
      const pageContent = document.querySelector('article')?.innerText || '';
      await navigator.clipboard.writeText(pageContent);
      // You might want to add a toast notification here
      console.log('Markdown copied to clipboard');
    } catch (err) {
      console.error('Failed to copy markdown:', err);
    }
  };

  const encodedContent = encodeURIComponent(window.location.href);

  return (
    <div className={styles.llmButtons}>
      <button
        className={styles.llmButton}
        onClick={() =>
          window.open(
            `https://chat.openai.com/?content=${encodedContent}`,
            '_blank',
          )
        }
      >
        Open in ChatGPT
      </button>
      <button
        className={styles.llmButton}
        onClick={() =>
          window.open(`https://claude.ai/?url=${encodedContent}`, '_blank')
        }
      >
        Open in Claude
      </button>
      <button className={styles.llmButton} onClick={handleCopyMarkdown}>
        Copy as Markdown
      </button>
    </div>
  );
}

LLMButtons.propTypes = {
  content: PropTypes.any,
};
