import { useState } from "react"
import { TabMenu } from ".."
import { ButtonLink } from "../Button"
import { HeaderWithLink } from "../HeaderWithLink"
import { ToolCard, ToolCardProps } from "../ToolCard"
import { TutorialCardProps } from "../TutorialCard"
import { PaginatedTutorialCardList } from "../TutorialCard/PaginatedTutorialCardList"

export type ToolsAndConceptsProps = {
  tools: ToolCardProps[]
  bottomButtons?: boolean
  headerButtontext?: string
  concepts?: TutorialCardProps[] // Not sure what this looks like yet.
  headerLink?: string
}

const ToolsAndConcepts = ({
  tools,
  concepts = [],
  headerButtontext = "",
  bottomButtons = true,
  headerLink = "",
}: ToolsAndConceptsProps) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <div>
          <HeaderWithLink className="text-h2 mb-2" headerLink={headerLink}>
            {concepts.length > 0 ? "SDKs & Tools" : "Tools"}
          </HeaderWithLink>
          <p>Some of our new and popular tooling to build on Flow.</p>
        </div>
        {!!headerButtontext.length && (
          <div className="hidden md:block">
            <ButtonLink href="#" variant="secondary" rightIcon="right">
              {headerButtontext}
            </ButtonLink>
          </div>
        )}
      </div>
      {concepts.length > 0 && (
        <TabMenu
          tabs={[{ name: "Tools" }, { name: "Concepts" }]}
          onTabChange={(index: number) => setSelectedTabIndex(index)}
        />
      )}
      {selectedTabIndex === 0 && (
        <div className="grid gap-4 pt-9 md:grid-cols-2 md:gap-8">
          {tools.map((tool: ToolCardProps, index) => (
            <ToolCard {...tool} key={index} />
          ))}
        </div>
      )}
      {selectedTabIndex === 1 && (
        <div className="pt-9">
          <PaginatedTutorialCardList tutorials={concepts} />
        </div>
      )}
      {!!bottomButtons && (
        <div className="mt-9 flex flex-col justify-between md:flex-row">
          <ButtonLink
            href="https://github.com/onflow/developer-portal/blob/main/app/data/tools/index.ts"
            className="mb-4 w-full md:mr-9 md:w-1/2"
            rightIcon="external"
          >
            Submit a tool
          </ButtonLink>
          <ButtonLink
            className="mb-4 w-full md:w-1/2"
            href="/tools"
            variant="secondary"
            rightIcon="right"
          >
            View all tools
          </ButtonLink>
        </div>
      )}
    </div>
  )
}

export default ToolsAndConcepts
