export const learnGridData = {
  title: 'Learn',
  sections: [
    {
      cards: [
        {
          heading: 'Hello World',
          description:
            'Build and deploy your first contract, connect to it from the frontend, and call your smart contract functions - all in less than 30 minutes.',
          iconColor: 'blue',
          cardColor: 'black',
          onClick: () => {
            window.location.href = 'https://docs.onflow.org/cadence/tutorial/hello-world/';
          }
        },
        {
          heading: 'Flow Cadence',
          description:
            'Cadence is a resource-oriented programming language that makes it easy to build secure, scalable, and composable applications.',
          iconColor: 'blue',
          cardColor: 'black',
          onClick: () => {
            window.location.href = 'https://docs.onflow.org/cadence/language-features/';
          }
        },
        {
          heading: 'Flow EVM',
          description:
            'The future is here.  Deploy your Solidity contracts on Flow to get sub-cent transaction fees, sponsored gas, and the ability to scale to millions of users.',
          iconColor: 'blue',
          cardColor: 'black',
          onClick: () => {
            window.location.href = 'evm/about';
          }
        },
        {
          heading: 'Tutorials',
          description:
            'Take deep dives into Flow, with Cadence, EVM, or both in the same app and learn advanced concepts to build the future of consumer applications.',
          iconColor: 'blue',
          cardColor: 'black',
          onClick: () => {
            window.location.href = 'tutorials';
          }
        },
        {
          heading: 'Flow Protocol',
          description:
            'Dive into the inner workings of the machine.  Learn how the protocol itself is designed to maintain costs and throughput to scale to a billion users.',
          iconColor: 'blue',
          cardColor: 'black',
          onClick: () => {
            window.location.href = 'networks/network-architecture';
          }
        },
      ],
    },
  ],
};