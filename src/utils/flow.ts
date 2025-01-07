import * as fcl from '@onflow/fcl';
import { ChallengeContractName } from './constants';
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

export function getChallengeIdentifier(
  contractName: ChallengeContractName,
): string {
  return typeIdentifier(getContractAddress(contractName), contractName);
}
