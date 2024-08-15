import React from 'react';
import Learn from '../../../../images/page/flow-learn-icon.svg';
import Quickstart from '../../../../images/page/flow-quickstart-icon.svg';
import Documentation from '../../../../images/page/flow-documentation-icon.svg';
import BentoCardStartHere from '../../../../images/misc/bento-card-start-here.png';
import BentoCardCadenceCourse from '../../../../images/misc/bento-card-cadence-course.png';
import BentoCardCadenceCourse2 from '../../../../images/misc/bento-card-cadence-course@2x.png';
import BentoCardPathQuest from '../../../../images/misc/bento-card-path-quest.png';
import BentoCardLangReference from '../../../../images/misc/bento-card-cadence-lang-reference.png';
import BentoCardLangReference2 from '../../../../images/misc/bento-card-cadence-lang-reference@2x.png';
import DevOfficeHours from '../../../../images/page/flow-dev-office-hours-icon.svg';
import AssistantGpt from '../../../../images/page/flow-assistant-gpt-icon.svg';
import DeveloperChat from '../../../../images/page/flow-developer-chat-icon.svg';
import NetworkUpgrade from '../../../../images/page/flow-network-upgrade-icon.svg';
import RoadmapLarge from '../../../../images/misc/roadmap-card-lg.png';
import RoadmapSmall from '../../../../images/misc/roadmap-card-sm.png';
import UpdatesLight from '../../../../images/misc/updates-light.png';
import UpdatesDark from '../../../../images/misc/updates-dark.png';
export interface HomepageStartItemIconsProps {
  icon: string;
}

export function HomepageStartItemIcons({
  icon,
}: HomepageStartItemIconsProps): React.ReactElement {
  switch (icon) {
    case 'learn':
      return <Learn />;
    case 'quickstart':
      return <Quickstart />;
    case 'documentation':
      return <Documentation />;
    case 'start-here':
      return <img src={BentoCardStartHere} alt="Start Here" />;
    case 'cadence-course':
      return (
        <>
          <img
            className="hidden md:block h-full w-full"
            src={BentoCardCadenceCourse2}
            alt="Cadence Course"
          />
          <img
            className="block md:hidden w-full"
            src={BentoCardCadenceCourse}
            alt="Cadence Course"
          />
        </>
      );
    case 'path-quest':
      return <img src={BentoCardPathQuest} alt="" />;
    case 'lang-reference':
      return (
        <>
          <img
            className="hidden md:block w-full"
            src={BentoCardLangReference2}
            alt="Language Reference"
          />
          <img
            className="block md:hidden w-full"
            src={BentoCardLangReference}
            alt="Language Reference"
          />
        </>
      );
    case 'roadmap':
      return (
        <>
          <img
            className="hidden md:block w-full"
            src={RoadmapLarge}
            alt="Roadmap"
          />
          <img
            className="block md:hidden w-full"
            src={RoadmapSmall}
            alt="Roadmap"
          />
        </>
      );
    case 'dev-office-hours':
      return <DevOfficeHours />;
    case 'flow-assistant-gpt':
      return <AssistantGpt />;
    case 'developer-chat':
      return <DeveloperChat />;
    case 'network-upgrade':
      return <NetworkUpgrade />;
    case 'updates':
      return (
        <span>
          <img
            className="hidden dark:block"
            src={UpdatesDark}
            alt="Flow Blockchain Updates"
          />
          <img
            className="dark:hidden"
            src={UpdatesLight}
            alt="Flow Blockchain Updates"
          />
        </span>
      );
    default:
      throw new Error(`Icon type not recognized ${icon}`);
  }
}
