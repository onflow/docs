import React from 'react';
import { colors } from '@site/src/constants/colors';
import { useProgress } from '@site/src/hooks/use-progress';
import { useCurrentUser } from '@site/src/hooks/use-current-user';

export const GoldStarPanel: React.FC = () => {
  const { getProgress } = useProgress();
  const { user } = useCurrentUser();

  const handleAskFlowAI = (e: React.MouseEvent) => {
    e.preventDefault();

    const el = document.querySelector('ask-cookbook') as HTMLElement & {
      shadowRoot?: ShadowRoot;
    };
    if (!el) {
      console.warn('ask-cookbook element not found');
      return;
    }

    const shadow = el.shadowRoot;
    if (!shadow) {
      console.warn('ask-cookbook has no shadowRoot');
      return;
    }

    const button = shadow.querySelector(
      '#ask-cookbook-button',
    ) as HTMLButtonElement;
    if (!button) {
      console.warn(
        'Internal #ask-cookbook-button not found in the shadow root',
      );
      return;
    }

    button.click();
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-2">
        <button
          onClick={() => window.open('https://calendar.google.com/calendar/embed?src=c_47978f5cd9da636cadc6b8473102b5092c1a865dd010558393ecb7f9fd0c9ad0%40group.calendar.google.com', '_blank')}
          className={`flex-1 ${colors.black.dark} text-white px-4 py-2 rounded-xl hover:bg-gray-700 appearance-none cursor-pointer border-0`}
        >
          Office Hours
        </button>
        <button
          onClick={() => window.open('https://github.com/orgs/onflow/discussions', '_blank')}
          className={`flex-1 ${colors.black.dark} text-white px-4 py-2 rounded-xl hover:bg-gray-700 appearance-none cursor-pointer border-0`}
        >
          Discussions
        </button>
        <button
          onClick={handleAskFlowAI}
          className={`flex-1 ${colors.black.dark} text-white px-4 py-2 rounded-xl hover:bg-gray-700 appearance-none cursor-pointer border-0`}
        >
          Ask Flow AI
        </button>
      </div>

      <div className={`${colors.black.dark} p-6 rounded-lg shadow-lg flex-1`}>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className={`${colors.flowgreen.light} h-2.5 rounded-full`} style={{ width: `${user.loggedIn ? getProgress() * 100 : 0}%` }}></div>
        </div>
        <p className="text-sm text-gray-100 mt-2">
          {user.loggedIn
            ? `Profile Completion: ${Math.round(getProgress() * 100)}%`
            : 'Please connect your wallet and create a profile'}
        </p>
      </div>
    </div>
  );
};
