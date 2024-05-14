module.exports = function (source) {
  const infoBannerMessage =
    'For Cadence 0.42 go to [Legacy Docs](https://legacy.developers.flow.com/)';
  // Function to check if a page content contains "cadence" code block
  const containsCadenceCodeBlock = (content) => {
    return content.includes('```cadence');
  };

  // Function to insert :::info::: tag into content
  const insertInfoTag = (content) => {
    const infoBanner = ':::info\n' + infoBannerMessage + '\n:::\n';
    // Check fof front matter
    if (!content.startsWith('---\n')) {
      // Insert :::info::: tag at the beginning of the content
      return infoBanner + content;
    }
    // Split the content into front matter and body
    const [frontMatter, ...body] = content.split('---\n').slice(1);

    // Insert :::info::: tag after front matter
    return `---\n${frontMatter}---\n${infoBanner}${body.join('---\n')}`;
  };

  // Check if the content contains a "cadence" code block
  if (containsCadenceCodeBlock(source)) {
    // Insert :::info::: tag
    return insertInfoTag(source);
  }

  // Return the original content if no changes are needed
  return source;
};
