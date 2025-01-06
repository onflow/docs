import React from 'react';
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
        <p className="text-center text-gray-500">This is a blank profile modal.</p>

        <div className="flex justify-center">
          <Button size="sm" className="w-full max-w-md" onClick={onClose}>
            Close Modal
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
