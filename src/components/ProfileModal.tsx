import React, { useEffect, useState } from 'react';
import Input from '@site/src/ui/design-system/src/lib/Components/Input';
import Field from '@site/src/ui/design-system/src/lib/Components/Field';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import RadioGroup from '@site/src/ui/design-system/src/lib/Components/RadioGroup';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { ProfileSettings, SocialType } from '../types/gold-star';
import { useProfile } from '../hooks/use-profile';
import { useCurrentUser } from '../hooks/use-current-user';
import { createProfile, setProfile } from '../utils/gold-star';
import _ from 'lodash';

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

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useCurrentUser();
  const { profile, isLoading, error } = useProfile(user.addr);
  const [settings, setSettings] = useState<ProfileSettings>({
    handle: '',
    socials: {},
    referralSource: '',
    deployedContracts: {},
  });
  const [loaded, setLoaded] = useState(false);

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

  async function handleSave() {
    if (!settings) return;

    if (profile) {
      await setProfile(settings);
    } else {
      await createProfile(settings);
    }
  }

  function hasChanges() {
    return (
      !_.isEqual(profile?.handle, settings?.handle) ||
      !_.isEqual(profile?.socials, settings?.socials) ||
      !_.isEqual(profile?.referralSource, settings?.referralSource) ||
      !_.isEqual(profile?.deployedContracts, settings?.deployedContracts)
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile">
      <div className="space-y-6">
        <div className="space-y-4">
          <Field label="Username" description="What should we call you?">
            <Input
              name="username"
              placeholder="johndoe"
              value={settings?.handle || ''}
              onChange={(e) =>
                setSettings({ ...settings, handle: e.target.value })
              }
            />
          </Field>
          <Field label="Github Handle" description="What's your Github handle?">
            <Input
              name="profile_handle"
              placeholder="joedoecodes"
              value={settings?.socials?.[SocialType.GITHUB] || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socials: { [SocialType.GITHUB]: e.target.value },
                })
              }
            />
          </Field>
        </div>

        <div className="max-w-sm mx-auto">
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
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            size="sm"
            className="w-full max-w-md"
            onClick={handleSave}
            disabled={!hasChanges() || !settings}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
