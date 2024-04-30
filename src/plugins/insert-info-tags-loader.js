module.exports = function (source) {
  const infoBannerMessage =
    'For Cadence 0.42 go to [Legacy Docs](https://legacy.developers.flow.com/)';
  // Function to check if a page content contains "cadence" code block
  const containsCadenceCodeBlock = (content) => {
    return content.includes('```cadence');
  };

  // Function to insert :::info::: tag into content
  const insertInfoTag = (content) => {
    // Insert :::info::: tag at the beginning of the content
    return ':::info\n' + infoBannerMessage + '\n:::\n' + content;
  };

  // Check if the content contains a "cadence" code block
  if (containsCadenceCodeBlock(source)) {
    // Insert :::info::: tag
    return insertInfoTag(source);
  }

  // Return the original content if no changes are needed
  return source;
};
