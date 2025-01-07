import * as fcl from '@onflow/fcl';
import { getContractAddress } from '../config/fcl';
import { Challenge } from '../types/gold-star';

export function typeIdentifier(
  address: string,
  contractName: string,
  type?: string,
): string {
  return `A.${fcl.sansPrefix(address)}.${contractName}${
    type ? `.${type}` : ''
  }`;
}

export function getChallengeIdentifier(challenge: Challenge): string {
  return typeIdentifier(
    getContractAddress(challenge.contractName),
    challenge.contractName,
    challenge.resourceIdentifier,
  );
}
