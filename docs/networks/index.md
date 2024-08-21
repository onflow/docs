---
sidebar_position: 1
---

import DocCardList from '@theme/DocCardList';
import { isSamePath } from '@docusaurus/theme-common/internal';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import { useLocation } from '@docusaurus/router';

# Networks

<DocCardList items={useDocsSidebar().items.filter(item => !isSamePath(item.href, useLocation().pathname))}/>