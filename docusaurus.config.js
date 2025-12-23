// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config();
const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const { remarkCodeHike } = require('@code-hike/mdx');

const path = require('path');
const fs = require('fs');

const flowNetwork = process.env.FLOW_NETWORK || 'testnet';
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;

const externalDataSourceLocation = './src/data/data-sources.json';
let cachedRepositories;

const hasTypesense =
  process.env.TYPESENSE_NODE && process.env.TYPESENSE_SEARCH_ONLY_API_KEY;

const mixpanelOnLoad = `
if ('${process.env.MIXPANEL_PROJECT_TOKEN}' && '${process.env.MIXPANEL_PROJECT_TOKEN}' !== 'undefined') {
  window.mixpanel.init('${process.env.MIXPANEL_PROJECT_TOKEN}');

  const viwedPayload = {
    'Page Name': document.title,
    'Page URL': window.location.pathname,
  }
  window.mixpanel.track('Page Viewed', viwedPayload);

  const playUrl = 'play.flow.com';
  const links = document.querySelectorAll('a') || [];
  const isPlayPage = Array.from(links).some((link) => link.href.includes(playUrl));

  if (isPlayPage) {
    window.mixpanel.track('Play Page Viewed', viwedPayload);
  }
  
  window.document.addEventListener('click', function (event) {
    var target = event.target;
  
    // Check if the clicked element is a link with an href attribute
    if (target.tagName === 'A' && target.hasAttribute('href')) {
      if (window.mixpanel) {
        const payload = {
          href: target.getAttribute('href'),
          id: target.id,
          class: target.className,
        }
        window.mixpanel.track('Link clicked', payload);
        const isPlay = payload.href.includes('play.flow.com');
        if (isPlay) {
          window.mixpanel.track('Play Link clicked', payload);        
        }
      }
    }
  });
}
`;

const fetchSporkData = async () => {
  const fetch = await import('node-fetch');
  let data = {};
  try {
    const response = await fetch.default(
      'https://raw.githubusercontent.com/onflow/flow/master/sporks.json',
    );
    data = (await response.json()) || {};
  } catch (error) {
    console.error('Error:', error);
  }
  return data;
};

const getUrl = () => {
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://developers.flow.com';
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'https://developers.flow.com';
};

/**
 * @typedef {Object} SourceDestination
 * @property {string} source - Source
 * @property {string} destination - Destination
 */

/**
 * @typedef {Object} Repository
 * @property {string} owner - Repo owner
 * @property {string} name - Repo name
 * @property {string} branch - Repo branch
 * @property {SourceDestination[]} data - Source-Destination
 */

/**
 * @typedef {Object} Repo
 * @property {Repository} repository - Repo owner
 */

/**
 * @returns {Repo[]}
 */
const getRepositories = () => {
  if (!cachedRepositories) {
    const filePath = path.join(__dirname, externalDataSourceLocation);
    try {
      cachedRepositories = JSON.parse(fs.readFileSync(filePath).toString());
    } catch (error) {
      console.error('Cannot parse: ' + error);
    }
  }
  return cachedRepositories;
};

/** @type {import('@docusaurus/plugin-content-docs').MetadataOptions['editUrl']} */
const editUrl = ({ docPath }) => {
  const repositories = getRepositories();

  const sourceRepository = repositories.reduce((acc, { repository }) => {
    if (acc) return acc;
    const sourceData = repository.data.find(({ destination }) =>
      docPath.includes(destination),
    );
    if (sourceData) {
      return {
        ...repository,
        ...sourceData,
      };
    }
    return acc;
  }, /** @type {Repository & SourceDestination | null} */ (null));

  if (!sourceRepository) {
    return `https://github.com/onflow/docs/tree/main/docs/${docPath}`;
  }
  const { owner, name, branch, source, destination } = sourceRepository;
  const sourceDocPath = docPath.replace(destination, source);
  return `https://github.com/${owner}/${name}/tree/${branch}/${sourceDocPath}`;
};

const baseUrl = process.env.BASE_URL || '/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Flow Developer Portal',
  tagline: '',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: getUrl(),
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'onflow', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          beforeDefaultRemarkPlugins: [
            require('./src/plugins/code-reference').plugin,
            [
              remarkCodeHike,
              { theme: 'nord', lineNumbers: true, showCopyButton: true },
            ],
          ],
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl,
          remarkPlugins: [require('remark-math')],
          rehypePlugins: [require('rehype-katex')],
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          numberPrefixParser: true,
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/ui/design-system/styles/main.css'),
            require.resolve('@code-hike/mdx/styles.css'),
            require.resolve('./src/css/custom.css'),
          ],
        },
        ...(process.env.GTAG
          ? {
              gtag: {
                trackingID: process.env.GTAG,
                anonymizeIP: true,
              },
            }
          : {}),
      }),
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            // spec: 'https://raw.githubusercontent.com/onflow/flow/master/openapi/access.yaml',
            spec: 'https://raw.githubusercontent.com/onflow/flow/87a8f227ad761fa61576b014e3562d3b6c38d8a6/openapi/access.yaml',
            route: '/http-api/',
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
          primaryColor: '#1890ff',
        },
      },
    ],
  ],

  themes: [hasTypesense && 'docusaurus-theme-search-typesense'].filter(Boolean),

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      // Update the image path and add metadata
      image: 'img/og-image-flow-docs-2025-dark.png',
      metadata: [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: getUrl() + '/img/og-image-flow-docs-2025-dark.png' },
        { property: 'og:image', content: getUrl() + '/img/og-image-flow-docs-2025-dark.png' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:type', content: 'website' },
        { property: 'og:description', content: 'Flow Developer Documentation - The future of culture and digital assets is built on Flow' },
        { property: 'og:logo', content: getUrl() + '/img/flow-docs-logo-light.png' },
      ],
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: '',
        logo: {
          alt: 'Flow Developer Portal Logo',
          src: 'img/flow-docs-logo-dark.png',
          srcDark: 'img/flow-docs-logo-light.png',
        },
        items: [
          {
            to: 'defi',
            position: 'left',
            label: 'DeFi',
            activeBasePath: '/defi',
          },
          {
            to: 'blockchain-development-tutorials',
            position: 'left',
            label: 'Tutorials',
            activeBasePath: '/blockchain-development-tutorials',
          },
          {
            to: 'build/flow',
            position: 'left',
            label: 'Build',
            activeBasePath: '/build',
          },
          {
            to: 'protocol/flow-networks',
            position: 'left',
            label: 'Protocol',
            activeBasePath: '/protocol',
          },
          {
            to: 'ecosystem',
            position: 'left',
            label: 'Ecosystem',
            activeBasePath: '/ecosystem',
          },
          // {
          //   type: 'custom-connectButton',
          //   position: 'right',
          //   label: 'Connect',
          // },
          {
            href: 'https://github.com/onflow',
            html: '<img src="" alt="GitHub" id="navbar-github" class="box-content h-32 w-32"/><span class="p-2 desktop:hidden">Github</span>',
            position: 'right',
            className: 'h-8 desktop:p-1',
          },
          {
            href: 'https://discord.gg/flow',
            html: '<img src="" alt="Discord" id="navbar-discord" class="box-content h-32 w-32"/><span class="p-2 desktop:hidden">Discord</span>',
            position: 'right',
            className: 'h-8 desktop:p-1',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Flow',
            items: [
              {
                label: 'Build with AI',
                to: '/blockchain-development-tutorials/use-AI-to-build-on-flow',
              },
              {
                label: 'Why Flow',
                to: '/blockchain-development-tutorials/flow-101',
              },
              {
                label: 'Tools',
                to: '/build/tools',
              },
              {
                label: 'Faucet',
                to: '/ecosystem/faucets',
              },
              {
                label: 'Builder Toolkit',
                to: '/ecosystem/developer-support-hub',
              },
            ],
          },
          {
            title: 'Cadence',
            items: [
              {
                label: 'Quickstart',
                to: '/blockchain-development-tutorials/cadence/getting-started',
              },
              {
                label: 'Build with Forte',
                to: '/blockchain-development-tutorials/forte',
              },
              {
                label: 'Cadence Advantages',
                to: '/blockchain-development-tutorials/cadence/cadence-advantages',
              },
              {
                label: 'React SDK',
                to: '/build/tools/react-sdk',
              },
              {
                label: 'Language Reference',
                href: 'https://cadence-lang.org/',
              }
            ],
          },
          {
            title: 'Solidity (EVM)',
            items: [
              {
                label: 'Quickstart',
                to: '/build/evm/quickstart',
              },
              {
                label: 'Native VRF',
                to: '/blockchain-development-tutorials/native-vrf',
              },
              {
                label: 'Batched Transactions',
                to: '/blockchain-development-tutorials/cross-vm-apps',
              },
              {
                label: 'Network Information',
                href: '/build/evm/networks',
              }
            ],
          },
          {
            title: 'Community & Support',
            items: [
              {
                label: 'Dev Office Hours',
                href: 'https://calendar.google.com/calendar/u/0/embed?src=c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0@group.calendar.google.com',
              },
              {
                label: 'Hackathons and Events',
                to: '/ecosystem/hackathons-and-events',
              },
              {
                href: 'https://discord.gg/flow',
                label: 'Discord',
              },
              {
                href: 'https://github.com/onflow',
                label: 'GitHub',
              },
              {
                href: 'https://flow.com/careers',
                label: 'Careers',
              },
            ],
          },
          {
            title: 'Network & Resources',
            items: [
              {
                href: 'https://status.flow.com/',
                label: 'Network Status',
              },
              {
                href: 'https://flowscan.io/',
                label: 'Block Explorer',
              },
              {
                href: 'https://port.flow.com/',
                label: 'Flow Port',
              },
              {
                href: 'https://flow.com/',
                label: 'Flow Website',
              },
              {
                href: 'https://flow.com/blog',
                label: 'Flow Blog',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Flow Foundation. All Rights Reserved.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      typesense: hasTypesense && {
        // Replace this with the name of your index/collection.
        // It should match the "index_name" entry in the scraper's "config.json" file.
        typesenseCollectionName: 'flow_docs',

        typesenseServerConfig: {
          nodes: [
            {
              host: process.env.TYPESENSE_NODE,
              port: 443,
              protocol: 'https',
            },
          ],
          apiKey: process.env.TYPESENSE_SEARCH_ONLY_API_KEY,
        },

        // Optional: Typesense search parameters: https://typesense.org/docs/0.24.0/api/search.html#search-parameters
        typesenseSearchParameters: {},

        // Optional
        contextualSearch: true,
      },
    }),
  plugins: [
    [require.resolve("./plugins/markdown-export"), {
      docsDir: "docs",
      blogDir: "blog",
      outDirRel: "md",
    }],
    function customizedSvgo() {
      return {
        name: 'docusaurus-svgo',
        configureWebpack(config) {
          // allow svgr to use svgo config file
          for (const rule of config.module?.rules || []) {
            if (
              rule &&
              typeof rule === 'object' &&
              rule.test?.toString() === '/\\.svg$/i'
            ) {
              for (const nestedRule of rule.oneOf || []) {
                if (nestedRule && typeof nestedRule === 'object' && nestedRule.use instanceof Array) {
                  for (const loader of nestedRule.use) {
                    if (
                      typeof loader === 'object' &&
                      loader?.loader === require.resolve('@svgr/webpack')
                    ) {
                      if (typeof loader.options === 'object') {
                        loader.options.svgoConfig = null;
                      }
                    }
                  }
                }
              }
            }
          }
          return {
            mergeStrategy: {
              'module.rules': 'replace',
            },
            module: {
              rules: config.module?.rules || [],
            },
          };
        },
      };
    },
    function tailwindPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
    // require('./plugins/networks')
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Please add redirects to vercel.json
        ],
      },
    ],
    function cadenceLoader() {
      return {
        name: 'cadence-loader',
        configureWebpack() {
          return {
            module: {
              rules: [
                {
                  test: /\.cdc$/,
                  use: 'raw-loader',
                },
              ],
            },
          };
        },
      };
    },

    require('./src/plugins/font-preload'),
  ],
  stylesheets: [
    {
      href: '/css/katex-optimized.css',
      type: 'text/css',
    },
    {
      href: require.resolve('./src/css/critical.css'),
      type: 'text/css',
    },
  ],

  scripts: [
    // Temporarily disabled - uncomment when needed
    // {
    //   src: `${baseUrl}mixpanel.js`,
    //   async: true,
    //   onload: mixpanelOnLoad,
    // },
    // {
    //   src: `${baseUrl}hotjar.js`,
    //   async: true,
    // },
  ],
  clientModules: [require.resolve('./src/modules/toolscards.ts')],

  customFields: {
    flowNetwork,
    walletConnectProjectId,
  },

  // Move deprecated markdown config to new location
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  
  // Enable partial Docusaurus Faster (keep webpack bundler for redocusaurus)
  future: {
    v4: true,
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
      rspackBundler: false,
    },
  },
};

module.exports = config;