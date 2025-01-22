import React, { useEffect, useState } from 'react';
import Input from '@site/src/ui/design-system/src/lib/Components/Input';
import Field from '@site/src/ui/design-system/src/lib/Components/Field';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import RadioGroup from '@site/src/ui/design-system/src/lib/Components/RadioGroup';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { Challenge, ProfileSettings, SocialType } from '../types/gold-star';
import { useProfile } from '../hooks/use-profile';
import { useCurrentUser } from '../hooks/use-current-user';
import { createProfile, setProfile } from '../utils/gold-star';
import { isEqual } from 'lodash';
import RemovableTag from '@site/src/ui/design-system/src/lib/Components/RemovableTag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useChallenges } from '../hooks/use-challenges';
import * as fcl from '@onflow/fcl';
import { z } from 'zod';
import { parseIdentifier, typeIdentifier } from '../utils/flow';
import { CONTRACT_IDENTIFIER_REGEX } from '../utils/constants';
import { useGithubUser } from '../hooks/use-github-user';
import { useDebounce } from '../hooks/use-debounce';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const flowSources = [
  { name: 'Hackathon', description: 'I participated in a hackathon.' },
  { name: 'Email', description: 'I learned about it through an email.' },
  { name: 'Flow.com', description: 'I found it on the Flow website.' },
  { name: 'Search', description: 'I searched for it online.' },
  { name: 'Existing Builder', description: 'I was already building on Flow.' },
  { name: 'Other', description: 'Another way not listed above.' },
];

const ProfileSettingsSchema = z.object({
  handle: z.string().nonempty('Username is required'),
  socials: z.record(z.string().nonempty()),
  referralSource: z.string().nonempty().optional(),
  deployedContracts: z.any(),
});

const TagInputSchema = z.string().refine(
  (value) => {
    return !value || CONTRACT_IDENTIFIER_REGEX.test(value.trim());
  },
  {
    message: 'Invalid contract identifier',
  },
);

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { challenges } = useChallenges();
  const { user } = useCurrentUser();
  const {
    profile,
    isLoading,
    error,
    mutate: mutateProfile,
  } = useProfile(user.addr);
  const [loaded, setLoaded] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);

  const [settings, setSettings] = useState<ProfileSettings>({
    handle: '',
    socials: {},
    referralSource: '',
    deployedContracts: {},
  });
  const [errors, setErrors] = useState<{
    handle?: string;
    socials?: string;
    referralSource?: string;
    deployedContracts?: string;
  }>({});
  const [touched, setTouched] = useState<{
    handle?: boolean;
    socials?: boolean;
    referralSource?: boolean;
    deployedContracts?: boolean;
  }>({});

  const { value: debouncedGithubHandle, isDebouncing: githubDebouncing } =
    useDebounce(settings?.socials?.[SocialType.GITHUB], 1000);
  const { user: githubUser, isLoading: githubFetchLoading } = useGithubUser(
    debouncedGithubHandle,
  );
  const isGithubLoading = githubFetchLoading || githubDebouncing;

  const validate = () => {
    let hasErrors = false;

    const tagInputResult = TagInputSchema.safeParse(tagInput);
    hasErrors = !tagInputResult.success;
    setTagError(
      tagInputResult.success ? null : tagInputResult.error.errors[0].message,
    );

    const result = ProfileSettingsSchema.safeParse(settings);
    hasErrors = !result.success || hasErrors;
    if (!result.success) {
      setErrors(
        result.error.errors.reduce((acc, error) => {
          const field = error.path[0];
          acc[field] = error.message;
          return acc;
        }, {}),
      );
    } else {
      setErrors({});
    }

    return !hasErrors;
  };

  const completedChallenges = Object.keys(profile?.submissions ?? {}).reduce(
    (acc, key) => {
      const challengeInfo = challenges?.[key];
      if (profile?.submissions[key]?.completed && challengeInfo) {
        acc.push(challengeInfo);
      }
      return acc;
    },
    [] as Challenge[],
  );

  useEffect(() => {
    if (profile && !loaded && !isLoading && !error) {
      setSettings({
        handle: profile.handle,
        socials: profile.socials,
        referralSource: profile.referralSource,
        deployedContracts: profile.deployedContracts,
      });
      setLoaded(true);
    }
  }, [profile, settings, loaded, isLoading, error]);

  useEffect(() => {
    validate();
  }, [settings, tagInput]);

  const handleAddTag = () => {
    const identifier = parseIdentifier(tagInput.trim());
    if (identifier) {
      setSettings({
        ...settings,
        deployedContracts: {
          ...settings?.deployedContracts,
          [identifier.address]: [
            ...(settings?.deployedContracts?.[identifier.address] || []),
            identifier.contractName,
          ],
        },
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const identifier = parseIdentifier(tagToRemove);
    if (identifier) {
      const newProfile = {
        ...profile,
        deployedContracts: {
          ...profile?.deployedContracts,
          [identifier.address]:
            profile?.deployedContracts?.[identifier.address]?.filter(
              (contractName) => contractName !== identifier.contractName,
            ) || [],
        },
      } as ProfileSettings;

      if (newProfile.deployedContracts?.[identifier.address]?.length === 0) {
        delete newProfile.deployedContracts?.[identifier.address];
      }

      setSettings(newProfile);
    }
  };

  async function handleSave() {
    if (!settings) return;

    // Set touched for all fields & validate
    setTouched({
      handle: true,
      socials: true,
      referralSource: true,
      deployedContracts: true,
    });

    if (!validate()) return;

    setTxStatus('Pending Approval...');
    try {
      let txId: string | null = null;
      if (profile) {
        txId = await setProfile(settings);
      } else {
        txId = await createProfile(settings);
      }

      setTxStatus('Saving Profile...');

      fcl
        .tx(txId)
        .onceSealed()
        .then(() => {
          mutateProfile();
        });

      await fcl.tx(txId).onceExecuted();

      if (profile) {
        mutateProfile({
          ...profile,
          handle: settings.handle || profile.handle,
          socials: settings.socials || profile.socials,
          referralSource: settings.referralSource || profile.referralSource,
          deployedContracts:
            settings.deployedContracts || profile.deployedContracts,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTxStatus(null);
      onClose();
    }
  }

  function hasChanges() {
    return (
      !isEqual(profile?.handle, settings?.handle) ||
      !isEqual(profile?.socials, settings?.socials) ||
      !isEqual(profile?.referralSource, settings?.referralSource) ||
      !isEqual(profile?.deployedContracts, settings?.deployedContracts)
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollable={true} title="Profile">
      <div className="space-y-6 flex flex-col">
        <div className="flex items-center w-24 h-24 mx-auto">
          {(isGithubLoading || !githubUser?.avatar_url) && (
            <FontAwesomeIcon icon={faUser} size="5x" className="mx-auto" />
          )}
          {!isGithubLoading && githubUser?.avatar_url && (
            <img
              src={githubUser?.avatar_url}
              className="w-24 h-24 rounded-full mx-auto"
            />
          )}
        </div>

        <div className="space-y-4">
          <Field
            label="Username"
            description="What should we call you?"
            error={touched.handle ? errors.handle : undefined}
          >
            <Input
              name="username"
              placeholder="johndoe"
              value={settings?.handle || ''}
              onChange={(e) =>
                setSettings({ ...settings, handle: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, handle: true })}
            />
          </Field>
          <Field
            label="Github Handle"
            description="What's your Github handle?"
            error={touched.socials ? errors.socials : undefined}
          >
            <Input
              name="github_handle"
              placeholder="joedoecodes"
              value={settings?.socials?.[SocialType.GITHUB] || ''}
              onChange={(e) => {
                const socials: Record<string, string> = {
                  ...settings.socials,
                  [SocialType.GITHUB]: e.target.value,
                };
                if (!socials[SocialType.GITHUB]) {
                  delete socials[SocialType.GITHUB];
                }
                setSettings({
                  ...settings,
                  socials,
                });
              }}
              onBlur={() => {
                setTouched({ ...touched, socials: true });
              }}
            />
          </Field>
        </div>

        <Field
          label="Contracts Deployed"
          description="Add your contracts in the identifer format (A.0x123.Foobar)."
          error={tagError || undefined}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                name="contract_input"
                placeholder="A.0x123.Foobar"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(settings?.deployedContracts || {}).map(
                ([address, contracts]) =>
                  contracts.map((contractName) => {
                    const identifier = typeIdentifier(address, contractName);
                    console.log('identifier', identifier);
                    return (
                      <RemovableTag
                        key={identifier}
                        name={identifier}
                        onRemove={() => handleRemoveTag(identifier)}
                      />
                    );
                  }),
              )}
            </div>
          </div>
        </Field>

        <div className="max-w-sm">
          <RadioGroup
            options={flowSources.map((source) => source.name)}
            value={settings?.referralSource || ''}
            onChange={(value) =>
              setSettings({ ...settings, referralSource: value })
            }
            label="How did you find Flow?"
            getDescription={(option) =>
              flowSources.find((source) => source.name === option)
                ?.description || ''
            }
          />
          {errors.referralSource && touched.referralSource && (
            <div className="text-red-500 text-sm">{errors.referralSource}</div>
          )}
        </div>

        {completedChallenges.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3">My Challenges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {completedChallenges.map((challenge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md text-center w-full"
                >
                  <FontAwesomeIcon
                    icon={faTrophy}
                    size="3x"
                    className="text-yellow-500 mb-4"
                  />
                  <p className="text-md font-bold mb-2">{challenge.name}</p>
                  <p className="text-sm text-gray-600">
                    {challenge.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button
            size="sm"
            className="w-full max-w-md"
            onClick={handleSave}
            disabled={!hasChanges() || !settings || !!txStatus}
          >
            {txStatus ? txStatus : 'Save Profile'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
