import FlowDocsLogo from '../../../../images/logos/flow-docs-logo.svg';
import OnFlowIcon from '../../../../images/logos/flow-icon-bw-light.svg';
import DiscordIcon from '../../../../images/social/discord-light.svg';
import ForumIcon from '../../../../images/social/forum-light.svg';
import GithubIcon from '../../../../images/social/github-light.svg';
import AppLink from '../AppLink';

// reduce repetition of the section layout in Footer component
const footerSections = [
  {
    header: 'Documentation',
    links: [
      {
        link: '/getting-started',
        text: 'Getting Started',
      },
      {
        link: '/tools',
        text: "SDK's & Tools",
      },
      {
        link: '/learn',
        text: 'Learning Resources',
      },
      {
        link: '/cadence',
        text: 'Cadence',
      },
      {
        link: '/mobile',
        text: 'Mobile',
      },
      {
        link: '/tools/fcl-js/',
        text: 'FCL',
      },
      {
        link: '/tools/flow-js-testing/',
        text: 'JS Testing Library',
      },
      {
        link: '/tools/flow-cli/',
        text: 'CLI',
      },
      {
        link: '/tools/emulator/',
        text: 'Emulator',
      },
      {
        link: 'https://github.com/onflow/fcl-dev-wallet',
        text: 'Dev Wallet',
      },
      {
        link: '/tools/vscode-extension/',
        text: 'VS Code Extension',
      },
    ],
  },
  {
    header: 'Community',
    links: [
      {
        link: '/community',
        text: 'Ecosystem',
      },
      {
        link: 'https://port.onflow.org/',
        text: 'Flow Port',
      },
      {
        link: 'https://github.com/onflow/developer-grants',
        text: 'Developer Grants',
      },
      {
        link: 'https://flow.com/flow-responsible-disclosure',
        text: 'Responsible Disclosure',
      },
      {
        link: 'https://forum.onflow.org/',
        text: 'Forum',
      },
      {
        link: 'https://www.flowverse.co/',
        text: 'Flowverse',
      },
      {
        link: 'https://academy.ecdao.org/',
        text: 'Emerald Academy',
      },
      {
        link: 'https://floats.city/',
        text: 'FLOATs (Attendance NFTs)',
      },
    ],
  },
  {
    header: 'Start Building',
    links: [
      {
        link: 'https://play.onflow.org/',
        text: 'Flow Playground',
      },
      {
        link: '/learn/kitty-items/',
        text: 'Kitty Items',
      },
      {
        link: '/cadence/tutorial/',
        text: 'Cadence Tutorials',
      },
      {
        link: 'https://open-cadence.onflow.org',
        text: 'Cadence Cookbook',
      },
      {
        link: '/flow/core-contracts/',
        text: 'Core Contracts & Standards',
      },
      {
        link: 'https://academy.ecdao.org/',
        text: 'Emerald DAO Bootcamp',
      },
    ],
  },
  {
    header: 'Network',
    links: [
      {
        link: 'https://status.onflow.org/',
        text: 'Network Status',
      },
      {
        link: 'https://flowscan.org/',
        text: 'Flowscan Mainnet',
      },
      {
        link: 'https://testnet.flowscan.org/',
        text: 'Flowscan Testnet',
      },
      {
        link: '/nodes/node-operation/past-sporks/',
        text: 'Past Sporks',
      },
      {
        link: '/nodes/node-operation/upcoming-sporks',
        text: 'Upcoming Sporks',
      },
      {
        link: '/nodes/node-operation/',
        text: 'Node Operation',
      },
      {
        link: '/nodes/node-operation/spork/',
        text: 'Spork Information',
      },
    ],
  },
];

export type FooterProps = {
  discordUrl: string;
  discourseUrl: string;
  flowUrl: string;
  githubUrl: string;
  sections?: typeof footerSections;
};

export const Footer = ({
  discordUrl,
  discourseUrl,
  flowUrl,
  githubUrl,
  sections = footerSections,
}: FooterProps) => {
  return (
    <footer className="bg-black px-6 text-white">
      <div className="container mx-auto">
        <div className="block items-center justify-between px-2 pt-8 pb-6 md:flex md:px-4 md:pt-16">
          <AppLink to="/" className="py-2 hover:opacity-75">
            <FlowDocsLogo
              className="origin-top-left scale-75"
              style={{
                transformOrigin: 'center left',
              }}
            />
          </AppLink>
          <div className="flex items-center gap-6 pt-8 md:pt-0">
            <AppLink to={githubUrl}>
              <img src={GithubIcon} height={32} width={32} />
            </AppLink>
            <AppLink to={discordUrl}>
              <img src={DiscordIcon} height={28} width={28} />
            </AppLink>
            <AppLink to={discourseUrl}>
              <img src={ForumIcon} height={24} width={24} />
            </AppLink>
            <AppLink to={flowUrl}>
              <img src={OnFlowIcon} height={28} width={28} />
            </AppLink>
          </div>
        </div>
        <div className="grid auto-cols-min gap-y-4 border-y border-y-primary-gray-400 px-2 pb-6 pt-9 xs:grid-cols-1 sm:grid-cols-2 sm:gap-x-12 md:gap-x-20 md:px-4 lg:grid-cols-[fit-content(25%)_fit-content(25%)_fit-content(25%)_fit-content(25%)]">
          {sections.map((section, i) => (
            <section key={i} className="w-fit pb-12 md:pb-0">
              <div className="pb-3">
                <h3 className="whitespace-nowrap text-base font-bold md:text-xl lg:text-2xl">
                  {section.header}
                </h3>
              </div>
              <ul>
                {section.links.map((link, j) => (
                  <li className="py-1 pl-0" key={j}>
                    <AppLink
                      className="whitespace-nowrap text-xs text-primary-gray-200 hover:text-primary-gray-100 md:text-sm lg:text-base"
                      to={link.link}
                    >
                      {link.text}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="px-2 pt-4 pb-16 lg:px-4">@2022 Flow</div>
      </div>
    </footer>
  );
};
