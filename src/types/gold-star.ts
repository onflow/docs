export interface ProfileSettings {
  handle?: string;
  referralSource?: string;
  socials?: Map<string, string>;
  deployedContracts?: DeployedContract[];
}

export interface DeployedContract {
  name: string;
  address: string;
}

export interface Profile {
  handle: string;
  referralSource?: string;
  socials: string[];
  deployedContracts: DeployedContract[];
  completedChallenges: {
    challengeType: string;
    completed: boolean;
  }[];
}

export interface ProfileResponse {
  handle: string;
  socials: string[];
  completedChallenges: {
    challengeType: string;
    completed: boolean;
  }[];
  deployedContracts: DeployedContract[];
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
