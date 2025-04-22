---
sidebar_position: 1
---

<!-- Import: DocCardList from "@theme/DocCardList" -->
<!-- Import: { isSamePath } from "@docusaurus/theme-common/internal" -->
<!-- Import: { useDocsSidebar } from "@docusaurus/plugin-content-docs/client" -->
<!-- Import: { useLocation } from "@docusaurus/router" -->

# Networks

<DocCardList items={useDocsSidebar().items.filter(item => !isSamePath(item.href, useLocation().pathname))}/>