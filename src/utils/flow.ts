import * as fcl from '@onflow/fcl';

export function typeIdentifier(
  address: string,
  contractName: string,
  type?: string,
): string {
  return `A.${fcl.sansPrefix(address)}.${contractName}${
    type ? `.${type}` : ''
  }`;
}
