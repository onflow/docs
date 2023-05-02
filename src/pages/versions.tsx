/**
 * Initially copied from
 * https://github.com/facebook/docusaurus/blob/main/website/src/pages/versions.tsx
 */

import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  useVersions,
  useLatestVersion,
} from '@docusaurus/plugin-content-docs/client';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const docsPluginId = undefined; // Default docs plugin instance

function DocumentationLabel(): JSX.Element {
  return (
    <Translate id="versionsPage.versionEntry.link">Documentation</Translate>
  );
}

export default function Version(): JSX.Element {
  const versions = useVersions(docsPluginId);
  const latestVersion = useLatestVersion(docsPluginId);
  const currentVersion = versions.find(
    (version) => version.name === 'current',
  )!;
  const pastVersions = versions.filter(
    (version) => version !== latestVersion && version.name !== 'current',
  );

  return (
    <Layout
      title="Versions"
      description="Docusaurus 2 Versions page listing all documented site versions"
    >
      <main className="container margin-vert--lg">
        <Heading as="h1">
          <Translate id="versionsPage.title">
            Flow documentation versions
          </Translate>
        </Heading>

        <div className="margin-bottom--lg">
          <Heading as="h3" id="next">
            <Translate id="versionsPage.current.title">
              Current version
            </Translate>
          </Heading>
          <p>
            <Translate id="versionsPage.current.description">
              Here you can find the documentation for current released version.
            </Translate>
          </p>
          <table>
            <tbody>
              <tr>
                <th>{latestVersion.label}</th>
                <td>
                  <Link to={latestVersion.path}>
                    <DocumentationLabel />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {currentVersion !== latestVersion && (
          <div className="margin-bottom--lg">
            <Heading as="h3" id="latest">
              <Translate id="versionsPage.next.title">
                Next version (Unreleased)
              </Translate>
            </Heading>
            <p>
              <Translate id="versionsPage.next.description">
                Here you can find the documentation for work-in-process
                unreleased version.
              </Translate>
            </p>
            <table>
              <tbody>
                <tr>
                  <th>{currentVersion.label}</th>
                  <td>
                    <Link to={currentVersion.path}>
                      <DocumentationLabel />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {pastVersions.length > 0 && (
          <div className="margin-bottom--lg">
            <Heading as="h3" id="archive">
              <Translate id="versionsPage.archived.title">
                Past versions (Not maintained anymore)
              </Translate>
            </Heading>
            <p>
              <Translate id="versionsPage.archived.description">
                Here you can find documentation for previous versions of Flow.
              </Translate>
            </p>
            <table>
              <tbody>
                {pastVersions.map((version) => (
                  <tr key={version.name}>
                    <th>{version.label}</th>
                    <td>
                      <Link to={version.path}>
                        <DocumentationLabel />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Layout>
  );
}
