import React from 'react'
import { LandingHeader } from '../../Components/LandingHeader'
import { type SDKCardProps } from '../../Components/SDKCard'
import { SDKCards } from '../../Components/SDKCards'
import PageBackground from '../shared/PageBackground'
import PageSection from '../shared/PageSection'
import PageSections from '../shared/PageSections'
import {
  ContentNavigationList,
  type ContentNavigationListProps,
} from '../../Components/ContentNavigationList'
import ToolsImage from '../../../../images/page/tools.png'
import {
  LandingPageSecondaryNav,
  type LandingPageSecondaryNavProps,
} from '../../Components/LandingPageSecondaryNav'

export interface ToolsPageProps {
  apisAndServices: SDKCardProps[]
  contentNavigationListItems: ContentNavigationListProps
  discordUrl: string
  editPageUrl?: string
  githubUrl: string
  explorers: SDKCardProps[]
  sdks: SDKCardProps[]
  secondaryNavSections: LandingPageSecondaryNavProps['sections']
  tools: SDKCardProps[]
  wallets: SDKCardProps[]
}

const ToolsPage = ({
  apisAndServices,
  contentNavigationListItems,
  discordUrl,
  editPageUrl,
  explorers,
  githubUrl,
  sdks,
  secondaryNavSections,
  tools,
  wallets,
}: ToolsPageProps) => {
  return (
    <PageBackground gradient="tools">
      <LandingPageSecondaryNav sections={secondaryNavSections} />
      <PageSections>
        <PageSection className="pt-0 pb-0">
          <LandingHeader
            buttonText="View guide"
            buttonUrl="/tutorials/DappArchitectures/"
            callout="Flow Dapp Architecture Guide"
            description="Wondering what tools you need? See our dapp architectures guide to help you out."
            discordUrl={discordUrl}
            editPageUrl={editPageUrl}
            githubUrl={githubUrl}
            title="Tools"
            imageSrc={ToolsImage}
          />
        </PageSection>
        <PageSection sectionId="development-tools">
          <SDKCards
            header="Development Tools"
            headerLink="development-tools"
            cards={tools}
            description="These essential tools will help you build, test, and debug your dapp on Flow."
          />
        </PageSection>
        <PageSection sectionId="wallets">
          <SDKCards
            header="Wallets"
            headerLink="wallets"
            cards={wallets}
            description="Integrate with these wallets to help your users onboard to Flow and manage their Flow accounts."
          />
        </PageSection>
        <PageSection sectionId="sdks">
          <SDKCards
            headerLink="sdks"
            header="SDKs"
            cards={sdks}
            description="Libraries that make it easy to connect to Flow in multiple languages and frameworks."
          />
        </PageSection>
        <PageSection sectionId="apis-and-services">
          <SDKCards
            headerLink="apis-and-services"
            header="APIs & Services"
            cards={apisAndServices}
            description="Hosted and open source services that abstract some of the most difficult parts of building on the blockchain."
          />
        </PageSection>
        <PageSection sectionId="flow-blockchain-explorers">
          <SDKCards
            header="Flow Blockchain Explorers"
            headerLink="flow-blockchain-explorers"
            cards={explorers}
            description="Different ways of looking up on-chain metrics, events, transactions, accounts, and more."
          />
        </PageSection>
        <PageSection sectionId="explore-more-content">
          <ContentNavigationList
            headerLink="explore-more-content"
            header={contentNavigationListItems.header}
            contentNavigationItems={
              contentNavigationListItems.contentNavigationItems
            }
          />
        </PageSection>
      </PageSections>
    </PageBackground>
  )
}

export default ToolsPage
