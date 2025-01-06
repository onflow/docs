import React, { useState } from 'react';
import Input from '@site/src/ui/design-system/src/lib/Components/Input';
import Field from '@site/src/ui/design-system/src/lib/Components/Field';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import RadioGroup from '@site/src/ui/design-system/src/lib/Components/RadioGroup';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const flowSources = [
  { name: 'Hackathon', description: 'I participated in a hackathon.' },
  { name: 'Email', description: 'I learned about it through an email.' },
  { name: 'Flow.com', description: 'I found it on the Flow website.' },
  { name: 'Search', description: 'I searched for it online.' },
];

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [selectedSource, setSelectedSource] = useState(flowSources[0].name);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile">
      <div className="space-y-6">

        <div className="space-y-4">
          <Field
            label="Username"
            description="What should we call you?"
          >
            <Input name="username" placeholder="johndoe" />
          </Field>
          <Field
            label="Github Handle"
            description="What's your Github handle?"
          >
            <Input name="profile_handle" placeholder="joedoecodes" />
          </Field>
        </div>

        <div className="max-w-sm mx-auto">
          <RadioGroup
            options={flowSources.map((source) => source.name)}
            value={selectedSource}
            onChange={setSelectedSource}
            label="How did you find Flow?"
            getDescription={(option) =>
              flowSources.find((source) => source.name === option)?.description || ''
            }
          />
        </div>

        <div className="flex justify-center">
          <Button size="sm" className="w-full max-w-md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
