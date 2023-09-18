// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config();
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const theme = require('shiki/themes/nord.json');
const { remarkCodeHike } = require('@code-hike/mdx');

const path = require('path');
const fs = require('fs');

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

  const playUrl = 'play.onflow.org';
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
        const isPlay = payload.href.includes('play.onflow.org');
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

  return 'https://onflow.github.io';
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
  }, null);
  if (!sourceRepository) {
    return `https://github.com/onflow/docs/tree/main/docs/${docPath}`;
  }
  const { owner, name, branch, source, destination } = sourceRepository;
  const sourceDocPath = docPath.replace(destination, source);
  return `https://github.com/${owner}/${name}/tree/${branch}/${sourceDocPath}`;
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Flow Developer Portal',
  tagline: '',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: getUrl(),
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.BASE_URL || '/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'onflow', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
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
          versions: {
            stable: {
              label: 'Current',
            },
          },
          beforeDefaultRemarkPlugins: [
            [
              remarkCodeHike,
              { theme, lineNumbers: true, showCopyButton: true },
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
        ...(process.env.GA_TRACKING_ID
          ? {
              gtag: {
                trackingID: process.env.GA_TRACKING_ID,
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
            spec: 'https://raw.githubusercontent.com/onflow/flow/master/openapi/access.yaml',
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

  themes: [
    'mdx-v2',
    hasTypesense && 'docusaurus-theme-search-typesense',
  ].filter(Boolean),

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      // Replace with your project's social card
      image: 'img/FlowDocs_Logo_FlowLogo_Horizontal_Green_BlackText.svg',
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
            to: 'concepts/start-here',
            position: 'left',
            label: 'Concepts',
          },
          {
            to: 'building-on-flow',
            position: 'left',
            label: 'Build',
          },
          {
            to: 'guides',
            position: 'left',
            label: 'Guides',
          },
          {
            to: 'cadence/intro',
            position: 'left',
            label: 'Cadence',
          },
          {
            to: 'tools',
            position: 'left',
            label: 'Tools',
          },
          {
            to: 'references',
            position: 'left',
            label: 'References',
          },
          {
            to: 'community-resources',
            position: 'left',
            label: 'Resources',
          },
          // Remove after cadence is updated to a stable version
          // https://github.com/onflow/docs/issues/105
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
          },
          {
            href: 'https://github.com/onflow',
            html: '<img src="" alt="GitHub" id="navbar-github" class="box-content h-32 w-32"/><span class="p-2 desktop:hidden">Github</span>',
            position: 'right',
            className: 'h-8 desktop:p-1',
          },
          {
            href: 'https://onflow.org/discord',
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
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/getting-started',
              },
              {
                label: "SDK's & Tools",
                to: '/tools',
              },
              {
                to: '/cadence/intro',
                label: 'Cadence',
              },
              {
                to: '/building-on-flow/mobile',
                label: 'Mobile',
              },
              {
                to: '/tools/clients/fcl-js/',
                label: 'FCL',
              },
              {
                to: '/tools/flow-js-testing/',
                label: 'JS Testing Library',
              },
              {
                to: '/tools/flow-cli/',
                label: 'CLI',
              },
              {
                to: '/tools/emulator/',
                label: 'Emulator',
              },
              {
                href: 'https://github.com/onflow/fcl-dev-wallet',
                label: 'Dev Wallet',
              },
              {
                to: '/tools/vscode-extension/',
                label: 'VS Code Extension',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                to: '/community-resources',
                label: 'Ecosystem',
              },
              {
                href: 'https://port.onflow.org/',
                label: 'Flow Port',
              },
              {
                href: 'https://github.com/onflow/developer-grants',
                label: 'Developer Grants',
              },
              {
                href: 'https://flow.com/flow-responsible-disclosure',
                label: 'Responsible Disclosure',
              },
              {
                href: 'https://forum.onflow.org/',
                label: 'Forum',
              },
              {
                href: 'https://www.flowverse.co/',
                label: 'Flowverse',
              },
              {
                href: 'https://academy.ecdao.org/',
                label: 'Emerald Academy',
              },
              {
                href: 'https://floats.city/',
                label: 'FLOATs (Attendance NFTs)',
              },
            ],
          },
          {
            title: 'Start Building',
            items: [
              {
                href: 'https://play.onflow.org/',
                label: 'Flow Playground',
              },
              {
                to: '/cadence/tutorial/first-steps',
                label: 'Cadence Tutorials',
              },
              {
                href: 'https://open-cadence.onflow.org',
                label: 'Cadence Cookbook',
              },
              {
                to: '/building-on-flow/core-contracts/',
                label: 'Core Contracts & Standards',
              },
              {
                href: 'https://academy.ecdao.org/',
                label: 'Emerald DAO Bootcamp',
              },
            ],
          },
          {
            title: 'Network',
            items: [
              {
                href: 'https://status.onflow.org/',
                label: 'Network Status',
              },
              {
                href: 'https://flowscan.org/',
                label: 'Flowscan Mainnet',
              },
              {
                href: 'https://testnet.flowscan.org/',
                label: 'Flowscan Testnet',
              },
              {
                to: '/building-on-flow/run-and-secure/nodes/node-operation/past-sporks/',
                label: 'Past Sporks',
              },
              {
                to: '/building-on-flow/run-and-secure/nodes/node-operation/upcoming-sporks',
                label: 'Upcoming Sporks',
              },
              {
                to: '/building-on-flow/run-and-secure/nodes/node-operation/',
                label: 'Node Operation',
              },
              {
                to: '/building-on-flow/run-and-secure/nodes/node-operation/spork/',
                label: 'Spork Information',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                href: 'https://github.com/onflow',
                label: 'GitHub',
              },
              {
                href: 'https://onflow.org/discord',
                label: 'Discord',
              },
              {
                href: 'https://forum.onflow.org/',
                label: 'Forum',
              },
              {
                href: 'https://onflow.org/',
                label: 'OnFlow',
              },
              {
                href: 'https://flow.com/blog',
                label: 'Blog',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Flow, Inc. Built with Docusaurus.`,
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
    /** this function needs doesn't pick up hot reload event, it needs a restart */
    // @ts-ignore
    function (context, options) {
      const { siteConfig } = context;
      return {
        name: 'docusaurus-flow-networks-plugin',
        async loadContent() {
          const networks = JSON.parse(
            fs
              .readFileSync(path.join(__dirname, './src/data/networks.json'))
              .toString(),
          );
          const sporks = await fetchSporkData();
          return {
            networks,
            sporks,
          };
        },
        async contentLoaded({ content, actions }) {
          // @ts-ignore
          const { networks, sporks } = content;
          const { addRoute, createData } = actions;
          const networksJsonPath = await createData(
            'networks.json',
            JSON.stringify(networks),
          );
          const sporksJsonPath = await createData(
            'sporks.json',
            JSON.stringify(sporks),
          );
          addRoute({
            path: `${siteConfig.baseUrl}network`,
            exact: true,
            component: '@site/src/components/networks',
            modules: {
              networks: networksJsonPath,
              sporks: sporksJsonPath,
            },
          });

          networks.forEach(async (network) => {
            const { urlPath } = network;

            addRoute({
              path: `${siteConfig.baseUrl}network/${urlPath}`,
              exact: true,
              component: '@site/src/components/network',
              modules: {
                networks: networksJsonPath,
                sporks: sporksJsonPath,
              },
            });
          });
        },
      };
    },
    // require('./plugins/networks')
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  scripts: [
    {
      src: '/mixpanel.js',
      async: true,
      onload: mixpanelOnLoad,
    },
    {
      src: 'https://widget.kapa.ai/kapa-widget.bundle.js',
      'data-website-id': '0f0b3ed1-7761-4986-851e-09336ea6ef1c',
      'data-project-name': 'Flow',
      'data-project-color': '#2E8555',
      'data-project-logo': 'https://cryptologos.cc/logos/flow-flow-logo.png',
      async: true,
    },
    {
      src: '/hotjar.js',
      async: true,
    },
    {
      src: 'https://widget.kapa.ai/kapa-widget.bundle.js',
      'data-website-id': '0f0b3ed1-7761-4986-851e-09336ea6ef1c',
      'data-project-name': 'Flow',
      'data-project-color': '#2E8555',
      'data-project-logo': 'https://cryptologos.cc/logos/flow-flow-logo.png',
      async: true,
    },
  ],
};

module.exports = config;
