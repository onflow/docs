---
sidebar_position: 1
---

import DocCardList from '@theme/DocCardList';
import { useDocsSidebar, isSamePath } from '@docusaurus/theme-common/internal';
import { useLocation } from '@docusaurus/router';

# Networks

<DocCardList items={useDocsSidebar().items.filter(item => !isSamePath(item.href, useLocation().pathname))}/>