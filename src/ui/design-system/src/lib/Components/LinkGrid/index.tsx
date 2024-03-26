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
  },
];

const SectionCard = ({
  header,
  links,
  imageName,
  more,
}: LinkGridSection): React.ReactNode => (
  <div className="border rounded-lg p-6 flex flex-col space-y-4">
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

export const LinkGrid = (): React.ReactNode => (
  <div className="p-8 border">
    <div className="flex justify-between justify-center">
      <h2 className="text-4xl mx-6">Explore the Docs</h2>
      <div className="flex justify-end mt-4">
        <div className="bg-transparent px-4 py-2 rounded-lg flex items-center space-x-2">
          <span>Read Docs</span>
          <ReadDocs />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {sections.map((section, index) => (
        <SectionCard key={index} {...section} />
      ))}
    </div>
  </div>
);
