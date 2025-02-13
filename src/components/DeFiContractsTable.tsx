import React from 'react';

interface ContractData {
  name: string;
  evmAddress: string;
  cadenceAddress?: string;
  evmUrl: string;
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
      'https://www.flowscan.io/ft/token/A.1e4aa0b87d10b141.EVMVMBridgedToken_f1815bd50389c46847f0bda824ec8da914045d14.Vault',
  },
  {
    name: 'Token B',
    evmAddress: '0x...',
    cadenceAddress: '0x...',
    evmUrl: 'https://evm.flowscan.io/token/0x...',
    cadenceUrl: 'https://flowscan.io/token/0x...',
  },
];

const DeFiContractsTable: React.FC<TableComponentProps> = ({ environment }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Contract Name</th>
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
