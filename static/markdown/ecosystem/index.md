---
sidebar_position: 1
title: Ecosystem
description: Access essential tools, knowledge, and community connections for the Flow Blockchain ecosystem.
---

<!-- Import: DocCardList from "@theme/DocCardList" -->
<!-- Import: { isSamePath } from "@docusaurus/theme-common/internal" -->
<!-- Import: { useDocsSidebar } from "@docusaurus/plugin-content-docs/client" -->
<!-- Import: { useLocation } from "@docusaurus/router" -->

<DocCardList items={
  [...useDocsSidebar().items.filter(item => !isSamePath(item.href, useLocation().pathname)),
    {
      type: 'link',
      label: 'Flow Forum',
      href: 'https://forum.onflow.org/',
      description: 'Engage with the Flow community, discuss ideas, and seek support on the Flow Blockchain Forum.',
      customProps: {
        icon: "🏛️"
      },
    },
    {
      type: 'link',
      label: 'FLIPs',
      href: 'https://github.com/onflow/flips',
      description: 'Flow Improvement Proposals (FLIPs) serve as a platform for engaging the Flow community in development, harnessing the collective ideas, insights, and expertise of contributors and experts while ensuring widespread communication of design changes.',
      customProps: {
        icon: "📜"
      },
    },
  ]
}/>