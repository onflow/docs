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
  socials: string[];
  completedChallenges: string[];
}

export interface ProfileResponse {
  handle: string;
  socials: string[];
  completedChallenges: string[];
}
