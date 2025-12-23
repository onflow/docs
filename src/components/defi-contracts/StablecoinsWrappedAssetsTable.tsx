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
  environment: 'evm' | 'cadence' | 'testnet';
}

const mainnetContracts: ContractData[] = [
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
    name: 'USDC',
    evmAddress: '0xF1815bd50389c46847f0Bda824eC8da914045D14',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_f1815bd50389c46847f0bda824ec8da914045d14',
    evmUrl:
      'https://evm.flowscan.io/token/0xF1815bd50389c46847f0Bda824eC8da914045D14',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_f1815bd50389c46847f0bda824ec8da914045d14.Vault',
  },
  {
    name: 'PYUSD0',
    evmAddress: '0x99aF3EeA856556646C98c8B9b2548Fe815240750',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_99af3eea856556646c98c8b9b2548fe815240750',
    evmUrl:
      'https://evm.flowscan.io/token/0x99aF3EeA856556646C98c8B9b2548Fe815240750',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_99af3eea856556646c98c8b9b2548fe815240750.Vault',
  },
  {
    name: 'MOET',
    evmAddress: '0x213979bB8A9A86966999b3AA797C1fcf3B967ae2',
    cadenceAddress: '0x6b00ff876c299c61',
    cadenceName: 'MOET',
    evmUrl:
      'https://evm.flowscan.io/token/0x213979bB8A9A86966999b3AA797C1fcf3B967ae2',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.6b00ff876c299c61.MOET.Vault',
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
    name: 'USDT',
    evmAddress: '0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_674843c06ff83502ddb4d37c2e09c01cda38cbc8',
    evmUrl:
      'https://evm.flowscan.io/token/0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_674843c06ff83502ddb4d37c2e09c01cda38cbc8.Vault',
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
    name: 'WBTC',
    evmAddress: '0x717DAE2BaF7656BE9a9B01deE31d571a9d4c9579',
    cadenceAddress: '0x1e4aa0b87d10b141',
    cadenceName: 'EVMVMBridgedToken_717dae2baf7656be9a9b01dee31d571a9d4c9579',
    evmUrl:
      'https://evm.flowscan.io/token/0x717DAE2BaF7656BE9a9B01deE31d571a9d4c9579',
    cadenceUrl:
      'https://www.flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_717dae2baf7656be9a9b01dee31d571a9d4c9579.Vault',
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

const testnetContracts: ContractData[] = [
  {
    name: 'USDF (Mock)',
    cadenceAddress: '0xb7ace0a920d2c37d',
    cadenceName: 'EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed',
    cadenceUrl:
      'https://testnet.flowscan.io/ft/token/A.b7ace0a920d2c37d.EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed.Vault',
  },
];

const StablecoinsWrappedAssetsTable: React.FC<TableComponentProps> = ({
  environment,
}) => {
  const contracts = environment === 'testnet' ? testnetContracts : mainnetContracts;
  const networkLabel = environment === 'testnet' ? 'Testnet' : 'Mainnet';
  
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Token Name</th>
            <th>
              {environment === 'evm'
                ? `Flow EVM ${networkLabel} Address`
                : `Flow Cadence ${networkLabel} Address`}
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
