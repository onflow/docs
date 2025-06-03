import GetChallenges from '../cadence/scripts/GetChallenges.cdc';
import GetProfile from '../cadence/scripts/GetProfile.cdc';
import CreateProfile from '../cadence/transactions/GoldStar/CreateProfile.cdc';
import UpdateProfile from '../cadence/transactions/GoldStar/UpdateProfile.cdc';
import Evaluate from '../cadence/transactions/LearnFlowChallenge/Evaluate.cdc';

import * as fcl from '@onflow/fcl';
import {
  Challenges,
  ChallengesResponse,
  Profile,
  ProfileResponse,
  ProfileSettings,
} from '../types/gold-star';

/**
 * Get the list of challenges
 * @returns The list of challenges
 */
export const getChallenges = async (): Promise<Challenges> => {
  const resp = (await fcl.query({
    cadence: GetChallenges,
  })) as ChallengesResponse;

  return resp;
};

/**
 * Get the profile for the given address
 * @param address
 * @returns The profile for the given address
 */
export const getProfile = async (address: string): Promise<Profile | null> => {
  const resp = (await fcl.query({
    cadence: GetProfile,
    args: (arg, t) => [arg(address, t.Address)],
  })) as ProfileResponse | null;

  if (!resp) {
    return null;
  }

  return {
    handle: resp.handle,
    socials: resp.socials,
    submissions: resp.submissions,
    deployedContracts: {
      cadenceContracts: resp.deployedContracts.cadenceContracts,
      evmContracts: resp.deployedContracts.evmContracts.map((x) =>
        fcl.withPrefix(x),
      ),
    },
    referralSource: resp.referralSource,
  };
};

/**
 * Create a new profile for the user
 * @param profile
 * @returns The transaction ID
 */
export const createProfile = async (profile: ProfileSettings) => {
  const cadenceContracts = profile.deployedContracts?.cadenceContracts || {};
  const evmContracts = profile.deployedContracts?.evmContracts || [];

  return await fcl.mutate({
    cadence: CreateProfile,
    args: (arg, t) => [
      arg(profile.handle, t.String),
      arg(profile.referralSource, t.Optional(t.String)),
      arg(
        Object.entries(cadenceContracts).map(([key, value]) => ({
          key,
          value,
        })),
        t.Dictionary({
          key: t.Address,
          value: t.Array(t.String),
        }),
      ),
      arg(evmContracts.map(fcl.sansPrefix), t.Array(t.String)),
      arg(
        profile.socials
          ? Object.entries(profile.socials).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
        fcl.t.Dictionary({
          key: fcl.t.String,
          value: fcl.t.String,
        }),
      ),
    ],
  });
};

/**
 * Update the profile for the user with the given settings.  This will overwrite the existing profile.
 * @param profile The new profile settings
 * @returns The transaction ID
 */
export const setProfile = async (profile: ProfileSettings) => {
  const cadenceContracts = profile.deployedContracts?.cadenceContracts || {};
  const evmContracts = profile.deployedContracts?.evmContracts || [];

  return await fcl.mutate({
    cadence: UpdateProfile,
    args: (arg, t) => [
      arg(profile.handle, t.String),
      arg(profile.referralSource, t.Optional(t.String)),
      arg(
        Object.entries(cadenceContracts).map(([key, value]) => ({
          key,
          value,
        })),
        t.Dictionary({
          key: t.Address,
          value: t.Array(t.String),
        }),
      ),
      arg(evmContracts.map(fcl.sansPrefix), t.Array(t.String)),
      arg(
        profile.socials
          ? Object.entries(profile.socials).map(([key, value]) => ({
              key,
              value,
            }))
          : [],
        t.Dictionary({
          key: t.String,
          value: t.String,
        }),
      ),
    ],
  });
};

/**
 * Submit "Learn Flow" challenge
 * @returns The transaction ID
 */
export const submitLearnFlowChallenge = async () => {
  return await fcl.mutate({
    cadence: Evaluate,
  });
};
