module.exports = function fontPreloadPlugin() {
  return {
    name: 'font-preload',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter/Inter-Regular.ttf',
              as: 'font',
              type: 'font/ttf',
              crossorigin: 'anonymous',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter/Inter-Medium.ttf',
              as: 'font',
              type: 'font/ttf',
              crossorigin: 'anonymous',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter/Inter-SemiBold.ttf',
              as: 'font',
              type: 'font/ttf',
              crossorigin: 'anonymous',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter/Inter-Bold.ttf',
              as: 'font',
              type: 'font/ttf',
              crossorigin: 'anonymous',
            },
          },
        ],
      };
    },
  };
};
