// Pylon chat plugin disabled - now using lazy loading via React component
module.exports = function pylonChatPlugin() {
  return {
    name: 'pylon-chat',
    injectHtmlTags() {
      return {
        headTags: [],
        postBodyTags: [],
      };
    },
  };
};
