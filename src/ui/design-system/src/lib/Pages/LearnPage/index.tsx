import React, { useMemo, useState } from "react"
import Filter from "../../../../images/action/filter2.svg"
import { SocialLinksSignup } from "../../Components"
import { ButtonLink } from "../../Components/Button"
import { HeaderWithLink } from "../../Components/HeaderWithLink"
import { LandingHeader } from "../../Components/LandingHeader"
import { ToggleButton } from "../../Components/ToggleButton"
import { TutorialCardProps } from "../../Components/TutorialCard"
import { PaginatedTutorialCardList } from "../../Components/TutorialCard/PaginatedTutorialCardList"
import {
  LargeVideoCard,
  LargeVideoCardProps,
} from "../../Components/VideoCard/LargeVideoCard"
import {
  SmallVideoCard,
  SmallVideoCardProps,
} from "../../Components/VideoCard/SmallVideoCard"
import PageBackground from "../shared/PageBackground"
import PageSection from "../shared/PageSection"
import PageSections from "../shared/PageSections"
import LearnImage from "../../../../images/page/learn.png"
import {
  ContentNavigationList,
  ContentNavigationListProps,
} from "../../Components/ContentNavigationList"
import { SocialLinksSignupProps } from "../../Components/SocialLinksSignup"

export type LearnPageProps = SocialLinksSignupProps & {
  allTutorials: TutorialCardProps[]
  architectureTutorials: TutorialCardProps[]
  cadenceHref: string
  cadenceTutorials: TutorialCardProps[]
  contentNavigationListItems: ContentNavigationListProps
  editPageUrl?: string
  nftTutorials: TutorialCardProps[]
  videos: {
    primary: LargeVideoCardProps
    secondary: SmallVideoCardProps[]
  }
  youtubeHref: string
}

export function LearnPage({
  allTutorials = [],
  architectureTutorials,
  cadenceHref,
  cadenceTutorials,
  contentNavigationListItems,
  discordUrl,
  discourseUrl,
  editPageUrl,
  githubUrl,
  nftTutorials,
  twitterUrl,
  videos,
  youtubeHref,
}: LearnPageProps) {
  const [filters, setFilters] = useState<string[]>([])

  const allTutorialsFiltered = useMemo(
    () =>
      filters.length > 0
        ? allTutorials.filter(({ tags }) =>
            filters.some((filter) => tags.includes(filter))
          )
        : allTutorials,
    [allTutorials, filters]
  )

  const tags: Array<string> = Array.from(
    new Set(
      allTutorials.reduce(
        (acc, { tags }) => [...acc, ...tags],
        [] as Array<string>
      )
    )
  ).sort()

  return (
    <PageBackground gradient="tools">
      <PageSections>
        <PageSection className="pt-0 pb-0">
          <LandingHeader
            title="Learn"
            buttonText="View Article"
            buttonUrl="https://jan-bernatik.medium.com/introduction-to-flow-blockchain-7532977c8af8"
            callout="Introduction to Flow Blockchain"
            description="When Dapper Labs built Crypto Kitties we learned a lot.
            Most importantly, we realized that the technology at the time was not ready for this kind of application.
            Being the visionaries we are, we set to build a better tech for what we plan to do.
            We set to build what is now Flow blockchain."
            discordUrl={discordUrl}
            editPageUrl={editPageUrl}
            githubUrl={githubUrl}
            imageSrc={LearnImage}
          />
        </PageSection>
        <PageSection className="flex-col items-stretch" sectionId="cadence">
          <div className="container">
            <div className="mb-6 flex items-baseline justify-between">
              <HeaderWithLink className="text-h2" headerLink="cadence">
                Cadence
              </HeaderWithLink>
              <ButtonLink
                variant="secondary"
                className="hidden whitespace-nowrap md:flex"
                href={cadenceHref}
                rightIcon="right"
              >
                Go to Cadence
              </ButtonLink>
            </div>
            <PaginatedTutorialCardList tutorials={cadenceTutorials} />
            <ButtonLink
              className="mt-6 w-full whitespace-nowrap md:hidden"
              href={cadenceHref}
              rightIcon="right"
              size="sm"
            >
              Go to Cadence
            </ButtonLink>
          </div>
        </PageSection>
        <PageSection className="flex-col items-stretch " sectionId="nfts">
          <div className="container">
            <HeaderWithLink headerLink="nfts" className="text-h2 f mb-6">
              NFTs
            </HeaderWithLink>
            <PaginatedTutorialCardList tutorials={nftTutorials} />
          </div>
        </PageSection>
        <PageSection
          className="flex-col items-stretch"
          sectionId="architecture"
        >
          <div className="container">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-h2">Architecture</h2>
            </div>
            <PaginatedTutorialCardList tutorials={architectureTutorials} />
          </div>
        </PageSection>
        <PageSection sectionId="featured-videos">
          <div className="container">
            <div className="mb-6 flex items-baseline justify-between">
              <HeaderWithLink headerLink="featured-videos" className="text-h2">
                Featured videos
              </HeaderWithLink>
              <ButtonLink
                variant="secondary"
                className="hidden whitespace-nowrap md:flex"
                href={youtubeHref}
                rightIcon="external"
              >
                Go to Youtube
              </ButtonLink>
            </div>
            <div className="flex flex-col items-stretch gap-4 md:flex-row">
              <div className="aspect-[1/1] md:aspect-[auto] md:basis-1/2">
                <LargeVideoCard {...videos.primary} />
              </div>
              <div className="flex flex-col gap-x-6 gap-y-5 md:basis-1/2">
                {videos.secondary.map((videoProps) => (
                  <SmallVideoCard key={videoProps.link} {...videoProps} />
                ))}
              </div>
            </div>
            <ButtonLink
              className="mt-6 w-full whitespace-nowrap md:hidden"
              href={youtubeHref}
              rightIcon="external"
              size="sm"
            >
              Go to Youtube
            </ButtonLink>
          </div>
        </PageSection>
        <PageSection sectionId="all-content">
          <div className="container">
            <HeaderWithLink headerLink="all-content" className="text-h2 mb-6">
              All content
            </HeaderWithLink>
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flow flow-col inline-flex items-center justify-center py-2 text-center text-base font-semibold">
                <Filter className="mr-2" /> Filter
              </div>
              {tags.map((tag) => (
                <ToggleButton
                  key={tag}
                  onClick={() => {
                    if (filters.includes(tag)) {
                      setFilters(filters.filter((value) => value !== tag))
                    } else {
                      setFilters([...filters, tag])
                    }
                  }}
                  isSelected={filters.includes(tag)}
                >
                  {tag}
                </ToggleButton>
              ))}
              {filters.length > 0 && (
                <button
                  className="font-semibold text-primary-blue"
                  onClick={() => setFilters([])}
                >
                  Clear all
                </button>
              )}
            </div>
            <PaginatedTutorialCardList
              listId={filters}
              tutorials={allTutorialsFiltered}
              pageSize={8}
              scrollOnPaginate={false}
            />
          </div>
        </PageSection>
        <PageSection sectionId="explore-more-content">
          <ContentNavigationList
            header={contentNavigationListItems.header}
            contentNavigationItems={
              contentNavigationListItems.contentNavigationItems
            }
            headerLink="explore-more-content"
          />
        </PageSection>
      </PageSections>
      <SocialLinksSignup
        discordUrl={discordUrl}
        discourseUrl={discourseUrl}
        githubUrl={githubUrl}
        twitterUrl={twitterUrl}
      />
    </PageBackground>
  )
}
