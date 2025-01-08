import React, { useState } from 'react';
import { Button } from '../ui/design-system/src/lib/Components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import { submitNoopChallenge } from '../utils/gold-star';
import * as fcl from '@onflow/fcl';
import { useProfile } from '../hooks/use-profile';
import { useCurrentUser } from '../hooks/use-current-user';

const ChallengeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const { user } = useCurrentUser();
  const { mutate: mutateProfile } = useProfile(user.addr);

  const completeChallenge = async () => {
    setTxStatus('Pending approval...');
    try {
      const txId = await submitNoopChallenge();

      setTxStatus('Submitting challenge...');

      fcl
        .tx(txId)
        .onceSealed()
        .then(() => {
          mutateProfile();
        });

      await fcl.tx(txId).onceExecuted();
    } catch (error) {
      console.error('Failed to complete challenge', error);
    } finally {
      setTxStatus(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Challenge Details">
      <div className="space-y-4 text-center">
        <FontAwesomeIcon icon={faBrain} size="5x" className="text-green-500" />
        <p className="text-lg text-gray-700 mt-4">
          By completing this challenge, you are declaring your intent to learn
          Flow and explore its capabilities.
        </p>
        <Button
          size="lg"
          className="w-full py-4 text-lg font-semibold mt-6"
          onClick={completeChallenge}
          disabled={txStatus !== null}
        >
          {txStatus ? txStatus : 'Complete Challenge'}
        </Button>
      </div>
    </Modal>
  );
};

export default ChallengeModal;
