export type Network = {
  /**
   * The statuspage.io component ID for this network
   * @see {@link https://developer.statuspage.io/#operation/getPagesPageIdComponents}
   */
  componentId: string

  /**
   * A unique id for the network. This should match the identifier
   * used by sporks (i.e. https://raw.githubusercontent.com/onflow/flow/master/sporks.json)
   */
  id: string

  /**
   * The user-facing display title for the network.
   */
  title: string

  /**
   * The URL path identifier for this network
   * (i.e. "flow-testnet" means the URL for this network details will be
   * "/netwoorks/flow-testnet")
   */
  urlPath: string
}

export const networks: Network[] = [
  {
    componentId: "nfr4t4jf0jw5",
    id: "mainnet-core-components",
    title: "Flow Mainnet Core Components",
    urlPath: "flow-mainnet-core-components",
  },
  {
    componentId: "xmgzlt62mtg4",
    id: "mainnet-access-apis",
    title: "Flow Mainnet Access APIs",
    urlPath: "flow-mainnet-access-apis",
  },
  {
    componentId: "g9d7vtywpdfq",
    id: "testnet",
    title: "Flow Testnet",
    urlPath: "flow-testnet",
  },
  {
    componentId: "1zmp931swvcs",
    id: "sandboxnet-core-components",
    title: "Flow Sandboxnet Core Components",
    urlPath: "flow-sandboxnet-core-components",
  },
  {
    componentId: "xc3zrll5td5p",
    id: "sandboxnet-access-apis",
    title: "Flow Sandboxnet Access APIs",
    urlPath: "flow-sandboxnet-access-apis",
  },
  // Exclude canarynet for now until we have sporks data.
  // {
  //   componentId: "s4z9n7p9pm3s",
  //   id: "canarynet",
  //   title: "Flow Canarynet",
  //   urlPath: "flow-canarynet",
  // },
]
