const flowNetworks = [
  {
    componentId: 'nfr4t4jf0jw5',
    id: 'mainnet-core-components',
    title: 'Flow Mainnet Core Components',
    urlPath: 'flow-mainnet-core-components',
  },
  {
    componentId: 'xmgzlt62mtg4',
    id: 'mainnet-access-apis',
    title: 'Flow Mainnet Access APIs',
    urlPath: 'flow-mainnet-access-apis',
  },
  {
    componentId: 'g9d7vtywpdfq',
    id: 'testnet',
    title: 'Flow Testnet',
    urlPath: 'flow-testnet',
  },
  {
    componentId: '1zmp931swvcs',
    id: 'sandboxnet-core-components',
    title: 'Flow Sandboxnet Core Components',
    urlPath: 'flow-sandboxnet-core-components',
  },
  {
    componentId: 'xc3zrll5td5p',
    id: 'sandboxnet-access-apis',
    title: 'Flow Sandboxnet Access APIs',
    urlPath: 'flow-sandboxnet-access-apis',
  },
  // Exclude canarynet for now until we have sporks data.
  // {
  //   componentId: "s4z9n7p9pm3s",
  //   id: "canarynet",
  //   title: "Flow Canarynet",
  //   urlPath: "flow-canarynet",
  // },
]

const getNetworks = () => {
  return flowNetworks
}

/** @type {import('@docusaurus/types').PluginConfig */
module.exports = function (context, options) {
  return {
    name: 'docusaurus-flow-networks-plugin',
    async loadContent () {
      return getNetworks()
    },
    async contentLoaded ({ content, actions }) {
      console.log(content)
      // const networks = content
      // const { addRoute } = actions
    }
  }
}
