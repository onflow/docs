import * as fcl from '@onflow/fcl';

import GetChallenges from '../../gold-star/cadence/scripts/GetChallenges.cdc';
import GetProfile from '../../gold-star/cadence/scripts/GetProfile.cdc';
import CreateProfile from '../../gold-star/cadence/transactions/GoldStar/CreateProfile.cdc';
import UpdateProfile from '../../gold-star/cadence/transactions/GoldStar/UpdateProfile.cdc';
import { ProfileResponse, ProfileSettings } from '../types/gold-star';

export const getProfile = async (address: string) => {
  const resp = fcl.query({
    cadence: GetProfile,
    args: (arg, t) => [arg(address, t.Address)],
  }) as Promise<ProfileResponse>;

  return {
    ...resp,
    socials: resp.socials.map((social) => social.value),
  };
};

// Create a new profile for the user with the given settings
export const createProfile = async (settings: ProfileSettings) => {
  fcl.mutate({
    cadence: CreateProfile,
    args: (arg, t) => [arg(name, t.String), arg(socials, t.Array(t.String))],
  });
};

// Fully replace the user's profile settings with new data
export const updateProfile = async (settings: ProfileSettings) => {
  fcl.mutate({
    cadence: UpdateProfile,
    args: (arg, t) => [arg(name, t.String)],
  });
};
