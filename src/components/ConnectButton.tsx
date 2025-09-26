import React, { useState } from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import Dropdown from '@site/src/ui/design-system/src/lib/Components/Dropdown';
import ProgressModal from '@site/src/components/ProgressModal';
import ProfileModal from '@site/src/components/ProfileModal';
import { useProgress } from '../hooks/use-progress';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useProfile } from '../hooks/use-profile';
import { useGithubAvatar } from '../hooks/use-github-avatar';
import { SocialType } from '../types/gold-star';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES } from '@site/src/constants/ga-events';

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-3)}`;
};

const ConnectButton: React.FC = () => {
  const { user, logIn, logOut } = useCurrentUser();
  const { profile } = useProfile(user.addr);
  const { avatar } = useGithubAvatar(profile?.socials?.[SocialType.GITHUB]);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { getProgress } = useProgress();

  const handleOpenProgress = () => {
    setIsProgressModalOpen(true);
  };

  const handleCloseProgressModal = () => {
    setIsProgressModalOpen(false);
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleSignInClick = () => {
    // Check if we're on the homepage
    const isHomepage = typeof window !== 'undefined' && window.location.pathname === '/';
    
    // Track the Sign In click
    event({
      action: isHomepage ? GA_EVENTS.ACTION_CARD_CLICK : GA_EVENTS.NAV_BAR_CLICK,
      category: isHomepage ? GA_CATEGORIES.NAV_BAR : GA_CATEGORIES.NAV_BAR,
      label: 'Nav-Sign In',
      location: true,
    });
    
    // Call the original logIn function
    logIn();
  };

  if (!user.loggedIn) {
    return (
      <Button size="sm" className="mr-2" onClick={handleSignInClick}>
        Sign In
      </Button>
    );
  }

  const formattedProgressValue = Math.floor(getProgress() * 100);

  const dropdownItems = [
    {
      label: `Progress (${formattedProgressValue}%)`,
      onClick: handleOpenProgress,
    },
    { label: 'Profile', onClick: handleOpenProfileModal },
    { label: 'Disconnect', onClick: logOut },
  ];

  return (
    <div className="hide-connect-on-mobile">
      <Dropdown
        buttonLabel={
          <div className="flex items-center gap-2">
            {avatar ? (
              <img
                src={avatar}
                alt="Github Avatar"
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} size="md" className="mx-auto" />
            )}
            <span className="text-sm text-gray-500">
              {formattedProgressValue}%
            </span>
          </div>
        }
        items={dropdownItems}
      />
      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={handleCloseProgressModal}
        onOpenProfileModal={() => {
          handleCloseProgressModal();
          handleOpenProfileModal();
        }}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
};

export default ConnectButton;
