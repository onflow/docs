import React, { useEffect, useState } from 'react';
import Input from '@site/src/ui/design-system/src/lib/Components/Input';
import Field from '@site/src/ui/design-system/src/lib/Components/Field';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
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
import {
  CONTRACT_IDENTIFIER_REGEX,
  EVM_ADDRESS_REGEX,
} from '../utils/constants';
import { useGithubAvatar } from '../hooks/use-github-avatar';
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
  referralSource: z.string().optional(),
  deployedContracts: z.object({
    cadenceContracts: z.record(z.array(z.string())),
    evmContracts: z.array(z.string()),
  }),
});

const CadenceTagInputSchema = z.string().refine(
  (value) => {
    return !value || CONTRACT_IDENTIFIER_REGEX.test(value.trim());
  },
  {
    message:
      'Invalid contract identifier, must be a valid Cadence identifier (A.0x123.Foobar).',
  },
);

const EvmTagInputSchema = z.string().refine(
  (value) => {
    return !value || EVM_ADDRESS_REGEX.test(value.trim());
  },
  {
    message:
      'Invalid contract identifier, must be a valid EVM address (0x1234567890abcdef1234567890abcdef12345678).',
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

  const [cadenceTagInput, setCadenceTagInput] = useState('');
  const [evmTagInput, setEvmTagInput] = useState('');

  const [cadenceTagError, setCadenceTagError] = useState<string | null>(null);
  const [evmTagError, setEvmTagError] = useState<string | null>(null);

  const [settings, setSettings] = useState<ProfileSettings>({
    handle: '',
    socials: {},
    referralSource: '',
    deployedContracts: {
      cadenceContracts: {},
      evmContracts: [],
    },
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
  const { avatar: avatar, isLoading: avatarLoading } = useGithubAvatar(
    debouncedGithubHandle,
  );
  const isAvatarLoading = avatarLoading || githubDebouncing;

  const validateCadenceTagInput = () => {
    const result = CadenceTagInputSchema.safeParse(cadenceTagInput);
    setCadenceTagError(result.success ? null : result.error.errors[0].message);
    return result.success;
  };

  const validateEvmTagInput = () => {
    const result = EvmTagInputSchema.safeParse(evmTagInput);
    setEvmTagError(result.success ? null : result.error.errors[0].message);
    return result.success;
  };

  const validate = () => {
    let hasErrors = !validateCadenceTagInput();
    hasErrors = !validateEvmTagInput() || hasErrors;

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
  }, [settings, cadenceTagInput, evmTagInput]);

  const handleAddCadenceTag = () => {
    if (!validateCadenceTagInput()) return;

    const identifier = parseIdentifier(cadenceTagInput.trim());
    if (identifier) {
      setSettings({
        ...settings,
        deployedContracts: {
          ...settings.deployedContracts,
          cadenceContracts: {
            ...settings.deployedContracts.cadenceContracts,
            [identifier.address]: [
              ...(settings.deployedContracts.cadenceContracts[
                identifier.address
              ] || []),
              identifier.contractName,
            ],
          },
        },
      });

      setCadenceTagInput('');
    }
  };

  const handleAddEvmTag = () => {
    if (!validateEvmTagInput()) return;

    if (EVM_ADDRESS_REGEX.test(evmTagInput.trim())) {
      setSettings({
        ...settings,
        deployedContracts: {
          ...settings.deployedContracts,
          evmContracts: [
            ...settings?.deployedContracts.evmContracts,
            evmTagInput.trim(),
          ],
        },
      });

      setEvmTagInput('');
    }
  };

  const handleRemoveCadenceTag = (tagToRemove: string) => {
    const identifier = parseIdentifier(tagToRemove);
    if (identifier) {
      const newSettings = {
        ...settings,
        deployedContracts: {
          ...settings.deployedContracts,
          cadenceContracts: {
            [identifier.address]:
              settings.deployedContracts.cadenceContracts?.[
                identifier.address
              ]?.filter(
                (contractName) => contractName !== identifier.contractName,
              ) || [],
          },
        },
      } as ProfileSettings;

      if (
        newSettings.deployedContracts?.cadenceContracts?.[identifier.address]
          ?.length === 0
      ) {
        delete newSettings.deployedContracts?.cadenceContracts?.[
          identifier.address
        ];
      }

      setSettings(newSettings);
    }
  };

  const handleRemoveEvmTag = (tagToRemove: string) => {
    setSettings({
      ...settings,
      deployedContracts: {
        ...settings.deployedContracts,
        evmContracts: settings?.deployedContracts.evmContracts.filter(
          (address) => address !== tagToRemove,
        ),
      },
    });
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

    handleAddCadenceTag();
    handleAddEvmTag();

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
      !isEqual(profile?.deployedContracts, settings?.deployedContracts) ||
      cadenceTagInput ||
      evmTagInput
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollable={true} title="Profile">
      <div className="space-y-6 flex flex-col">
        <div className="flex flex-col items-center w-24 h-24 mx-auto mb-4">
          {(isAvatarLoading || !avatar) && (
            <FontAwesomeIcon icon={faUser} size="5x" className="mx-auto" />
          )}
          {!isAvatarLoading && avatar && (
            <img src={avatar} className="w-24 h-24 rounded-full mx-auto" />
          )}
          {user?.addr && (
            <div className="text-center text-sm text-gray-500 mt-2">
              {user.addr}
            </div>
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
          label="Cadence Contracts Deployed"
          description="Add your contracts in the Cadence address format (A.0x123.Foobar)."
          error={cadenceTagError || undefined}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                name="cadence_contract_input"
                placeholder="A.0x123.Foobar"
                value={cadenceTagInput}
                onChange={(e) => setCadenceTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCadenceTag()}
              />
              <Button
                size="sm"
                onClick={handleAddCadenceTag}
                disabled={!cadenceTagInput}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                settings?.deployedContracts?.cadenceContracts || {},
              ).map(([address, contracts]) =>
                contracts.map((contractName) => {
                  const identifier = typeIdentifier(address, contractName);
                  return (
                    <RemovableTag
                      key={identifier}
                      name={identifier}
                      onRemove={() => handleRemoveCadenceTag(identifier)}
                    />
                  );
                }),
              )}
            </div>
          </div>
        </Field>

        <Field
          label="EVM Contracts Deployed"
          description="Add your contracts in the EVM address format (0x1234567890abcdef1234567890abcdef12345678)."
          error={evmTagError || undefined}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                name="evm_contract_input"
                placeholder="0x1234567890abcdef1234567890abcdef12345678"
                value={evmTagInput}
                onChange={(e) => setEvmTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEvmTag()}
              />
              <Button
                size="sm"
                onClick={handleAddEvmTag}
                disabled={!evmTagInput}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(settings?.deployedContracts?.evmContracts || []).map(
                (address) => (
                  <RemovableTag
                    key={address}
                    name={address}
                    onRemove={() => handleRemoveEvmTag(address)}
                  />
                ),
              )}
            </div>
          </div>
        </Field>

        <div className="max-w-sm">
          <Field
            label="How did you find Flow?"
            description="Let us know how you discovered Flow."
            error={touched.referralSource ? errors.referralSource : undefined}
          >
            <select
              className="w-full p-2 border rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={settings?.referralSource || ''}
              onChange={(e) =>
                setSettings({ ...settings, referralSource: e.target.value })
              }
              onBlur={() => setTouched({ ...touched, referralSource: true })}
            >
              <option value="" disabled>
                Select a referral source
              </option>
              {flowSources.map((source) => (
                <option key={source.name} value={source.name}>
                  {source.name}
                </option>
              ))}
            </select>
          </Field>
          {touched.referralSource && errors.referralSource && (
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
                  className="flex flex-col items-center p-6 rounded shadow-md text-center w-full bg-white dark:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-200 text-gray-800 border dark:border-gray-200"
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
            variant="primary"
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
