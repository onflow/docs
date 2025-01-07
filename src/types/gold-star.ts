export interface ProfileSettings {
  handle?: string;
  referralSource?: string;
  socials?: { [type: string]: string };
  deployedContracts?: { [address: string]: string[] };
}
export interface Profile {
  handle: string;
  referralSource?: string;
  socials: { [type: string]: string };
  deployedContracts: { [address: string]: string[] };
  submissions: { [challengeType: string]: { completed: boolean } };
}

export interface ProfileResponse {
  handle: string;
  socials: { [type: string]: string };
  submissions: { [challengeType: string]: { completed: boolean } };
  deployedContracts: { [address: string]: string[] };
  referralSource?: string;
}

export type ChallengesResponse = {
  [typeIdentifier: string]: {
    name: string;
    description: string;
  };
};

export type Challenges = {
  [typeIdentifier: string]: Challenge;
};

export type Challenge = {
  name: string;
  description: string;
};

export enum SocialType {
  GITHUB = 'github',
}
