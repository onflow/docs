
type SporkNetwork = 'mainnet' | 'testnet'
interface ISpork {
  id: number
  name: string
  sporkTime: string
  accessNodes: string[]
  rootHeight: string
  rootParentId: string
  rootStateCommitment: string
  gitCommitHash: string
}

export const normalizeSporks = (sporks: { networks: Record<SporkNetwork, Record<string, ISpork>> }) => {
  const pastSporks = Object.entries(sporks.networks).reduce(
    (acc, [curr, currentNetwork]) => {
      const normalized = Object.values(currentNetwork).map(
        (currentSpork) => ({
          heading: currentSpork.name,
          timestamp: currentSpork.sporkTime,
          sporkMetadata: {
            accessNode: currentSpork.accessNodes.join(', '),
            date: currentSpork.sporkTime,
            rootHeight: currentSpork.rootHeight,
            rootParentId: currentSpork.rootParentId,
            rootStateCommit: currentSpork.rootStateCommitment,
            gitCommit: currentSpork.gitCommitHash,
          },
        })
      )

      return { ...acc, [curr]: normalized }
    },
    {}
  )

  return pastSporks
}
