import * as fcl from '@onflow/fcl';
import { getContractAddress } from '../config/fcl';

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
