import * as fcl from '@onflow/fcl';
import { getContractAddress } from '../config/fcl';
import { CONTRACT_IDENTIFIER_REGEX } from './constants';

export function typeIdentifier(
  address: string,
  contractName: string,
  type?: string,
): string {
  return `A.${fcl.sansPrefix(address)}.${contractName}${
    type ? `.${type}` : ''
  }`;
}

export function getChallengeIdentifier(challenge: {
  contractName: string;
  resourceIdentifier: string;
}): string {
  return typeIdentifier(
    getContractAddress(challenge.contractName),
    challenge.contractName,
    challenge.resourceIdentifier,
  );
}

export function parseIdentifier(identifier: string): {
  address: string;
  contractName: string;
} | null {
  const match = identifier.match(CONTRACT_IDENTIFIER_REGEX);
  if (!match) {
    return null;
  }

  const [, , address, contractName] = match;
  return { address: fcl.withPrefix(address), contractName };
}
