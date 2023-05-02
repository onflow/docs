// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
require('dotenv').config();
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const path = require('path');
const fs = require('fs');

const docCollectionsLocation = './src/data/doc-collections';
let cachedSources;

const mixpanelOnLoad = `
if ('${process.env.MIXPANEL_PROJECT_TOKEN}') {
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

/**
 *
 * @returns string[]
 */
const getDocFileNames = () => {
  let files = [];
  try {
    const docCollectionPath = path.join(__dirname, docCollectionsLocation, '/');
    const allFiles = fs.readdirSync(docCollectionPath);
    files = allFiles.filter((filename) => filename.match(/\.json$/)) ?? [];
  } catch (error) {
    console.error('Unable to scan directory: ' + error);
  }
  return files;
};
const getRedirects = () => {
  const routeMapping = require('./src/data/routeMapping');

  const redirects = Object.entries(routeMapping).reduce((acc, [from, to]) => {
    if (acc[to]) {
      return { ...acc, [to]: [...acc[to], from] };
    }
    return { ...acc, [to]: [from] };
  }, {});

  const redirectsArray = Object.entries(redirects).reduce(
    (acc, [to, from]) => [...acc, { to, from }],
    [],
  );

  return redirectsArray;

  // return JSON.parse(
  //   fs
  //     .readFileSync(path.join(__dirname, './src/data/redirects.json'))
  //     .toString(),
  // );
};

const getDataSources = () => {
  return JSON.parse(
    fs
      .readFileSync(path.join(__dirname, './src/data/data-sources.json'))
      .toString(),
  );
};
/**
 *
 * @param {string} filename
 * @returns string
 */
const getSource = (filename) => {
  const filePath = path.join(__dirname, docCollectionsLocation, filename);
  try {
    const fileContent = JSON.parse(fs.readFileSync(filePath).toString());
    return fileContent.source;
  } catch (error) {
    console.error('Cannot parse: ' + error);
  }
};

/**
 * @typedef {Object} Source
 * @property {string} owner - Repo owner
 * @property {string} name - Repo name
 * @property {string} branch - Repo branch
 * @property {string} rootPath - Subrepo root path
 */

/**
 * @returns {Source[]}
 */
const getSources = () => {
  if (!cachedSources) {
    const docFilenames = getDocFileNames();

    cachedSources = docFilenames.reduce((acc, filename) => {
      const source = getSource(filename);
      if (!source) {
        return acc;
      }
      return [...acc, source];
    }, []);
  }
  return cachedSources;
};

/** @type {import('@docusaurus/plugin-content-docs').MetadataOptions['editUrl']} */
const editUrl = ({ docPath }) => {
  const docPathArray = docPath.split('/');
  const repoName = docPathArray[0];
  const sources = getSources();

  const sourceRepo = sources.find(({ name }) => name === repoName);
  if (!sourceRepo) {
    return;
  }
  const { owner, name, branch } = sourceRepo;
  const sourceDockPath = docPathArray.slice(1).join('/');
  return `https://github.com/${owner}/${name}/tree/${branch}/docs/${sourceDockPath}`;
};

const ignoreFiles = () => {
  const sources = getDataSources();
  const files =
    sources?.flatMap((repo) =>
      repo?.repository?.data.flatMap(
        (data) =>
          data?.ignore?.map((ignore) => `${data.destination}/${ignore}`) ?? [],
      ),
    ) ?? [];
  console.log('Ignore these files', files);
  return files;
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Flow docs',
  tagline: 'Dinosaurs are cool',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://onflow.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.BASE_URL || '/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'onflow', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
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
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl,
          remarkPlugins: [require('remark-math')],
          rehypePlugins: [require('rehype-katex')],
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          exclude: ignoreFiles(),
          numberPrefixParser: true,
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/ui/design-system/styles/main.css'),
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      // Replace with your project's social card
      image: 'img/FlowDocs_Logo_FlowLogo_Horizontal_Green_BlackText.svg',
      navbar: {
        title: '',
        logo: {
          alt: 'Flow Developer Portal Logo',
          src: 'img/flow-docs-logo-dark.png',
          srcDark: 'img/flow-docs-logo-light.png',
        },
        items: [
          {
            to: 'next/Concepts/intro',
            position: 'left',
            label: 'Concepts',
          },
          {
            to: 'next/Tutorials/intro',
            position: 'left',
            label: 'Tutorials',
          },
          {
            to: 'next/Cadence/intro',
            position: 'left',
            label: 'Cadence',
          },
          {
            to: 'next/Tooling/intro',
            position: 'left',
            label: 'Tooling',
          },
          {
            to: 'next/References/Introduction',
            position: 'left',
            label: 'References',
          },
          {
            to: 'next/Community-Resources/Introduction',
            position: 'left',
            label: 'Community Resources',
          },
          {
            href: 'https://github.com/onflow',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://onflow.org/discord',
            label: 'Discord',
            position: 'right',
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
                to: '/learn',
                label: 'Learning Resources',
              },
              {
                to: '/cadence',
                label: 'Cadence',
              },
              {
                to: '/mobile',
                label: 'Mobile',
              },
              {
                to: '/tools/fcl-js/',
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
                to: '/community',
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
                to: '/learn/kitty-items/',
                label: 'Kitty Items',
              },
              {
                to: '/cadence/tutorial/',
                label: 'Cadence Tutorials',
              },
              {
                href: 'https://open-cadence.onflow.org',
                label: 'Cadence Cookbook',
              },
              {
                to: '/flow/core-contracts/',
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
                to: '/nodes/node-operation/past-sporks/',
                label: 'Past Sporks',
              },
              {
                to: '/nodes/node-operation/upcoming-sporks',
                label: 'Upcoming Sporks',
              },
              {
                to: '/nodes/node-operation/',
                label: 'Node Operation',
              },
              {
                to: '/nodes/node-operation/spork/',
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
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Flow, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: process.env.ALGOLIA_APP_ID,

        // Public API key: it is safe to commit it
        apiKey: process.env.ALGOLIA_API_KEY,

        indexName: process.env.ALGOLIA_INDEX_NAME,

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        // ... other Algolia params
      },
    }),
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: getRedirects(),
        createRedirects(existingPath) {
          return undefined; // Return a falsy value: no redirect created
        },
      },
    ],
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
          const sporks = JSON.parse(
            fs
              .readFileSync(path.join(__dirname, './src/data/sporks.json'))
              .toString(),
          );
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
  ],
};

module.exports = config;
