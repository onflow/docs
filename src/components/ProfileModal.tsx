import React from 'react';
import Input from '@site/src/ui/design-system/src/lib/Components/Input';
import Field from '@site/src/ui/design-system/src/lib/Components/Field';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
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
