import { cadence } from '@onflow/fcl';
import React from 'react';

interface ContractData {
  name: string;
  evmAddress?: string;
  cadenceAddress?: string;
  evmUrl?: string;
  cadenceUrl?: string;
}

interface TableComponentProps {
  contracts: ContractData[];
  environment: 'evm' | 'cadence';
}

const contracts = [
  {
    name: 'USDC (stgUSDC)',
    evmAddress: '0xF1815bd50389c46847f0Bda824eC8da914045D14',
    cadenceAddress:
      'EVMVMBridgedToken_f1815bd50389c46847f0bda824ec8da914045d14',
    evmUrl:
      'https://evm.flowscan.io/token/0xF1815bd50389c46847f0Bda824eC8da914045D14',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_f1815bd50389c46847f0bda824ec8da914045d14.Vault',
  },
  {
    name: 'USDT (stgUSDT)',
    evmAddress: '0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8',
    cadenceAddress:
      'EVMVMBridgedToken_674843c06ff83502ddb4d37c2e09c01cda38cbc8',
    evmUrl:
      'https://evm.flowscan.io/token/0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_674843c06ff83502ddb4d37c2e09c01cda38cbc8.Vault',
  },
  {
    name: 'USDF (USD Flow)',
    evmAddress: '0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED',
    cadenceAddress:
      'EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed',
    evmUrl:
      'https://evm.flowscan.io/token/0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_2aabea2058b5ac2d339b163c6ab6f2b6d53aabed.Vault',
  },
  {
    name: 'USDC.e (Celer)',
    evmAddress: '0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52',
    cadenceAddress: '0xf1ab99c82dee3526',
    evmUrl:
      'https://evm.flowscan.io/token/0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52',
    cadenceUrl:
      'https://flowscan.io/ft/token/A.f1ab99c82dee3526.USDCFlow.Vault',
  },
  {
    name: 'WFLOW',
    evmAddress: '0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e',
    cadenceAddress: '0x1654653399040a61',
    evmUrl:
      'https://evm.flowscan.io/token/0xd3bF53DAC106A0290B0483EcBC89d40FcC961f3e',
    cadenceUrl:
      'https://www.flowscan.io/ft/token/A.1654653399040a61.FlowToken.Vault',
  },
];

const DeFiContractsTable: React.FC<TableComponentProps> = ({ environment }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Asset / Protocol</th>
            <th>
              {environment === 'evm'
                ? 'Flow EVM Mainnet Address'
                : 'Flow Cadence Mainnet Address'}
            </th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
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
                  {contract.name}
                </a>
              </td>
              <td>
                <code>
                  {environment === 'evm'
                    ? contract.evmAddress
                    : contract.cadenceAddress || 'N/A'}
                </code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeFiContractsTable;
