import React from 'react';
import { LinkGridImage } from './LinkGridImage';
import ReadDocs from '../../../../images/page/read-docs.svg';

export interface GridLink {
  title: string;
  href: string;
}

export interface LinkGridSection {
  links: GridLink[];
  header: string;
  imageName: string;
  more: string;
  showBorder?: boolean;
}

export interface LinkGridProps {
  sections: LinkGridSection[];
}

const sections: LinkGridSection[] = [
  {
    header: 'Introduction',
    links: [
      { title: 'What is Flow?', href: '/docs/flow-overview' },
      { title: 'Flow Basics', href: '/docs/flow-basics' },
      { title: 'Flow Ecosystem', href: '/docs/flow-ecosystem' },
      { title: 'Flow Token', href: '/docs/flow-token' },
      { title: 'Flow Architecture', href: '/docs/flow-architecture' },
    ],
    imageName: 'docs-introduction',
    more: '/',
  },
  {
    header: 'Fundamentals',
    links: [
      { title: 'What is Flow?', href: '/docs/flow-overview' },
      { title: 'Flow Basics', href: '/docs/flow-basics' },
      { title: 'Flow Ecosystem', href: '/docs/flow-ecosystem' },
      { title: 'Flow Token', href: '/docs/flow-token' },
      { title: 'Flow Architecture', href: '/docs/flow-architecture' },
    ],
    imageName: 'docs-fundamentals',
    more: '/',
  },
  {
    header: 'The Stack',
    links: [
      { title: 'What is Flow?', href: '/docs/flow-overview' },
      { title: 'Flow Basics', href: '/docs/flow-basics' },
      { title: 'Flow Ecosystem', href: '/docs/flow-ecosystem' },
      { title: 'Flow Token', href: '/docs/flow-token' },
      { title: 'Flow Architecture', href: '/docs/flow-architecture' },
    ],
    imageName: 'docs-the-stack',
    more: '/',
  },
  {
    header: 'Advanced',
    links: [
      { title: 'What is Flow?', href: '/docs/flow-overview' },
      { title: 'Flow Basics', href: '/docs/flow-basics' },
      { title: 'Flow Ecosystem', href: '/docs/flow-ecosystem' },
      { title: 'Flow Token', href: '/docs/flow-token' },
      { title: 'Flow Architecture', href: '/docs/flow-architecture' },
    ],
    imageName: 'docs-advanced',
    more: '/',
    showBorder: false,
  },
];

const SectionCard = ({
  header,
  links,
  imageName,
  more,
  showBorder = true,
}: LinkGridSection): React.ReactNode => {
  const borderStyle = showBorder
    ? 'border border-solid border-gray-400 border-t-0 border-b-0 border-l-0'
    : '';
  return (
    <div className={`p-6 flex flex-col space-y-4 ${borderStyle}`}>
      <LinkGridImage imageName={imageName} />
      <h3 className="text-lg font-semibold">{header}</h3>
      <div className="space-y-2 flex flex-col gap-1">
        {links.map((link, index) => (
          <span
            key={index}
            className="hover:underline hover:primary-green cursor-pointer"
          >
            <a href={link.href}>{link.title}</a>
          </span>
        ))}
      </div>
      <a
        href={more}
        className="border-none bg-transparent font-semibold hover:underline mt-auto py-5"
      >
        More
      </a>
    </div>
  );
};

export const LinkGrid = (): React.ReactNode => (
  <div className="container border border border-solid border-gray-400 rounded-lg p-0">
    <div className="p-8 flex items-center justify-between justify-center border-b border-t-0 border-r-0 border-l-0 border-solid border-gray-400">
      <div className="text-4xl px-6">Explore the Docs</div>
      <div className="px-6 flex items-center gap-2 font-semibold">
        Read Docs
        <ReadDocs className="stroke-current" />
      </div>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      {sections.map((section, index) => (
        <SectionCard key={index} {...section} />
      ))}
    </div>
  </div>
);
