module.exports = function fontPreloadPlugin() {
  return {
    name: 'font-preload',
    injectHtmlTags() {
      return {
        headTags: [
          // Preload critical fonts
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
          // Add @font-face declarations for the preloaded fonts
          {
            tagName: 'style',
            attributes: {},
            innerHTML: `
              @font-face {
                font-family: "Inter";
                src: local("Inter"), url("/fonts/inter/Inter-Regular.ttf") format("truetype");
                font-weight: 400;
                font-display: swap;
              }
              @font-face {
                font-family: "Inter";
                src: local("Inter"), url("/fonts/inter/Inter-Medium.ttf") format("truetype");
                font-weight: 500;
                font-display: swap;
              }
              @font-face {
                font-family: "Inter";
                src: local("Inter"), url("/fonts/inter/Inter-SemiBold.ttf") format("truetype");
                font-weight: 600;
                font-display: swap;
              }
              @font-face {
                font-family: "Inter";
                src: local("Inter"), url("/fonts/inter/Inter-Bold.ttf") format("truetype");
                font-weight: 700;
                font-display: swap;
              }
            `,
          },
        ],
      };
    },
  };
};
