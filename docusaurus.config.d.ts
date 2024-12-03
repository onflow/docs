import type { DocusaurusConfig } from '@docusaurus/types';

declare module '@generated/docusaurus.config' {
  interface CustomFields {
    flowNetwork: string;
  }

  interface CustomDocusaurusConfig extends DocusaurusConfig {
    customFields: CustomFields;
  }

  const config: CustomDocusaurusConfig;
  export default config;
}
