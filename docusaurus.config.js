// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const path = require('path');
const fs = require('fs');

const docCollectionsLocation = './src/data/doc-collections'
let cachedSources;

/**
 * 
 * @returns {string[]}
 */
const getDocFileNames = () => {
  try {
    const docCollectionPath = path.join(__dirname, docCollectionsLocation)
    const files = fs.readdirSync(docCollectionPath)
    return files.filter((filename) => filename.match(/\.json$/))
  } catch (error) {
    console.log('Unable to scan directory: ' + error);
  }
}
/**
 * 
 * @param {string} filename 
 * @returns {string}
 */
const getSource = (filename) => {
  const filePath = path.join(__dirname, docCollectionsLocation, filename)
  try {
    const fileContent = JSON.parse(fs.readFileSync(filePath).toString())
    return fileContent.source
  } catch (error) {
    console.log('Cannot parse: ' + error);
  }
  
}

/**
 * @typedef {Object} Source
 * @property {string} owner - The X Coordinate
 * @property {string} name - The Y Coordinate
 * @property {string} branch - The Y Coordinate
 * @property {string} rootPath - The Y Coordinate
 */

/**
 * @returns {Source[]}
 */
const getSources = () => {
  if (!cachedSources) {
    const docFilenames = getDocFileNames()
    
    cachedSources = docFilenames.reduce((acc, filename) => {
      const source = getSource(filename)
      if (!source) {
        return acc
      }
      return [...acc, source]
      
    }, [])
  }
  return cachedSources
}

/** @type {import('@docusaurus/plugin-content-docs').MetadataOptions['editUrl']} */
const editUrl = ({ docPath }) => {
  const docPathArray = docPath.split('/')
  const repoName = docPathArray[0]
  const sources = getSources();

  const sourceRepo = sources.find(({ name }) => name === repoName)
  if (!sourceRepo) {
    return
  }
  const { owner, name, branch } = sourceRepo
  const sourceDockPath = docPathArray.slice(1).join('/');
  console.log(sourceDockPath)
  return `https://github.com/${owner}/${name}/tree/${branch}/docs/${sourceDockPath}`;
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://onflow.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/flow-docusaurus/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'onflow', // Usually your GitHub org/user name.
  projectName: 'flow-docusaurus', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

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
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            spec: 'https://raw.githubusercontent.com/onflow/flow/master/openapi/access.yaml',
            route: '/api/',
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
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'My Site',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Tutorial',
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
