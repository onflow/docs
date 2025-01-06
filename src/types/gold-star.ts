export interface ProfileSettings {
  handle?: string;
  referralSource?: string;
  socials?: Map<string, string>;
  deployedContracts?: { [address: string]: string[] };
}
export interface Profile {
  handle: string;
  referralSource?: string;
  socials: string[];
  deployedContracts: { [address: string]: string[] };
  submissions: { [challengeType: string]: { completed: boolean } };
}

export interface ProfileResponse {
  handle: string;
  socials: string[];
  submissions: { [challengeType: string]: { completed: boolean } };
  deployedContracts: { [address: string]: string[] };
  referralSource?: string;
}

export interface ChallengeResponse {
  id: string;
  name: string;
  description: string;
}

export interface Challenge {
  name: string;
  description: string;
}

export enum SocialType {
  GITHUB = 'github',
}
