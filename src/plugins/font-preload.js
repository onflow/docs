module.exports = function fontPreloadPlugin() {
  return {
    name: 'font-preload',
    injectHtmlTags() {
      return {
        headTags: [
          // Preload critical fonts (WOFF2 format - 66% smaller!)
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter-woff2/Inter-Regular.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter-woff2/Inter-Medium.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter-woff2/Inter-SemiBold.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous',
            },
          },
          {
            tagName: 'link',
            attributes: {
              rel: 'preload',
              href: '/fonts/inter-woff2/Inter-Bold.woff2',
              as: 'font',
              type: 'font/woff2',
              crossorigin: 'anonymous',
            },
          },
          // Add @font-face declarations for the preloaded fonts (WOFF2 with TTF fallbacks)
          {
            tagName: 'style',
            attributes: {},
            innerHTML: `
              @font-face {
                font-family: "Inter";
                src: local("Inter"), 
                     url("/fonts/inter-woff2/Inter-Regular.woff2") format("woff2"),
                     url("/fonts/inter/Inter-Regular.ttf") format("truetype");
                font-weight: 400;
                font-display: swap;
              }
              @font-face {
                font-family: "Inter";
                src: local("Inter"), 
                     url("/fonts/inter-woff2/Inter-Medium.woff2") format("woff2"),
                     url("/fonts/inter/Inter-Medium.ttf") format("truetype");
                font-weight: 500;
                font-display: swap;
              }
              @font-face {
                font-family: "Inter";
                src: local("Inter"), 
                     url("/fonts/inter-woff2/Inter-SemiBold.woff2") format("woff2"),
                     url("/fonts/inter/Inter-SemiBold.ttf") format("truetype");
                font-weight: 600;
                font-display: swap;
              }
              @font-face {
                font-family: "Inter";
                src: local("Inter"), 
                     url("/fonts/inter-woff2/Inter-Bold.woff2") format("woff2"),
                     url("/fonts/inter/Inter-Bold.ttf") format("truetype");
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
