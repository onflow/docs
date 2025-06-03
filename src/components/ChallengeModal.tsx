import React, { useState } from 'react';
import { Button } from '../ui/design-system/src/lib/Components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import { submitLearnFlowChallenge } from '../utils/gold-star';
import * as fcl from '@onflow/fcl';
import { useProfile } from '../hooks/use-profile';
import { useCurrentUser } from '../hooks/use-current-user';
import { getChallengeIdentifier } from '../utils/flow';
import { GOLD_STAR_CHALLENGES } from '../utils/constants';

const ChallengeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const { user } = useCurrentUser();
  const { profile, mutate: mutateProfile } = useProfile(user.addr);

  const completeChallenge = async () => {
    setTxStatus('Pending Approval...');
    try {
      const txId = await submitLearnFlowChallenge();

      setTxStatus('Submitting Challenge...');

      fcl
        .tx(txId)
        .onceSealed()
        .then(() => {
          mutateProfile();
        });

      await fcl.tx(txId).onceExecuted();

      if (profile) {
        mutateProfile(
          {
            ...profile,
            submissions: {
              [getChallengeIdentifier(
                GOLD_STAR_CHALLENGES.LEARN_FLOW_CHALLENGE,
              )]: {
                completed: true,
              },
            },
          },
          false,
        );
      }
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
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
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
