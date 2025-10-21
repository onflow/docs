import React from 'react';

interface ContractData {
  name: string;
  evmAddress?: string;
  cadenceAddress?: string;
  cadenceName?: string;
  evmUrl?: string;
  cadenceUrl?: string;
}

interface TableComponentProps {
  contracts: ContractData[];
  environment: 'evm' | 'cadence';
}

const contracts: ContractData[] = [
  {
    name: 'FLOW',
    evmAddress: '0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e',
    cadenceAddress: '0x1654653399040a61',
    cadenceName: 'FlowToken',
    evmUrl:
      'https://evm.flowscan.io/token/0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e',
    cadenceUrl:
      'https://www.flowscan.io/ft/token/A.1654653399040a61.FlowToken.Vault',
  },
  {
    name: 'USDC (stgUSDC)',
    evmAddress: '0xF1815bd50389c46847f0Bda824eC8da914045D14',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_f1815bd50389c46847f0bda824ec8da914045d14',
    evmUrl:
      'https://evm.flowscan.io/token/0xF1815bd50389c46847f0Bda824eC8da914045D14',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_f1815bd50389c46847f0bda824ec8da914045d14.Vault',
  },
  {
    name: 'USDT (stgUSDT)',
    evmAddress: '0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_674843c06ff83502ddb4d37c2e09c01cda38cbc8',
    evmUrl:
      'https://evm.flowscan.io/token/0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_674843c06ff83502ddb4d37c2e09c01cda38cbc8.Vault',
  },
  {
    name: 'USDF (USD Flow)',
    evmAddress: '0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed',
    evmUrl:
      'https://evm.flowscan.io/token/0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed.Vault',
  },
  {
    name: 'USDF (Mock)',
    cadenceAddress: '0xb7ace0a920d2c37d',
    cadenceName: 'EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.b7ace0a920d2c37d.EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed.Vault',
  },
  {
    name: 'USDC.e (Celer)',
    evmAddress: '0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52',
    cadenceAddress: '0xf1ab99c82dee3526',
    cadenceName: 'USDCFlow',
    evmUrl:
      'https://evm.flowscan.io/token/0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.f1ab99c82dee3526.USDCFlow.Vault',
  },
  {
    name: 'stFlow (Increment Staked FLOW)',
    evmAddress: '0x5598c0652B899EB40f169Dd5949BdBE0BF36ffDe',
    cadenceAddress: '0xd6f80565193ad727',
    cadenceName: 'stFlowToken',
    evmUrl:
      'https://evm.flowscan.io/token/0x5598c0652B899EB40f169Dd5949BdBE0BF36ffDe',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.d6f80565193ad727.stFlowToken.Vault',
  },
  {
    name: 'ankrFLOWEVM (Ankr Staked FLOW)',
    evmAddress: '0x1b97100eA1D7126C4d60027e231EA4CB25314bdb',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_1b97100ea1d7126c4d60027e231ea4cb25314bdb',
    evmUrl:
      'https://evm.flowscan.io/token/0x1b97100eA1D7126C4d60027e231EA4CB25314bdb',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_1b97100ea1d7126c4d60027e231ea4cb25314bdb.Vault',
  },
  {
    name: 'WETH',
    evmAddress: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_2f6f07cdcf3588944bf4c42ac74ff24bf56e7590',
    evmUrl:
      'https://evm.flowscan.io/token/0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_2f6f07cdcf3588944bf4c42ac74ff24bf56e7590.Vault',
  },
  {
    name: 'cbBTC',
    evmAddress: '0xA0197b2044D28b08Be34d98b23c9312158Ea9A18',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_a0197b2044d28b08be34d98b23c9312158ea9a18',
    evmUrl:
      'https://evm.flowscan.io/token/0xA0197b2044D28b08Be34d98b23c9312158Ea9A18',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_a0197b2044d28b08be34d98b23c9312158ea9a18.Vault',
  },
];

const StablecoinsWrappedAssetsTable: React.FC<TableComponentProps> = ({
  environment,
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Token Name</th>
            <th>
              {environment === 'evm'
                ? 'Flow EVM Mainnet Address'
                : 'Flow Cadence Mainnet Address'}
            </th>
            {environment === 'evm' ? (
              <></>
            ) : (
              <th>Flow Cadence Contract Name</th>
            )}
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => {
            // Exception: Rename WFLOW to FLOW when in Cadence environment
            const displayName =
              environment === 'evm' && contract.name === 'FLOW'
                ? 'WFLOW'
                : contract.name;

            return (
              <tr key={index}>
                <td>
                  <a
                    href={
                      environment === 'evm'
                        ? contract.evmUrl
                        : contract.cadenceUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displayName}
                  </a>
                </td>
                <td>
                  <code>
                    {environment === 'evm'
                      ? contract.evmAddress
                      : contract.cadenceAddress}
                  </code>
                </td>
                {environment === 'evm' ? (
                  <></>
                ) : (
                  <td>{contract.cadenceName}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StablecoinsWrappedAssetsTable;
