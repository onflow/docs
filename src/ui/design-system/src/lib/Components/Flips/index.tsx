import React, { useState } from "react"
import { ButtonLink } from "../Button"
import { HeaderWithLink } from "../HeaderWithLink"
import FlipCell, { FlipCellHeader, FlipCellProps } from "./FlipCell"

export type FlipsProps = {
  githubUrl: string
  goodPlacesToStartFlips: FlipCellProps[]
  headerLink?: string
  openFlips: FlipCellProps[]
}

export default function Flips({
  githubUrl,
  goodPlacesToStartFlips,
  headerLink = "",
  openFlips,
}: FlipsProps) {
  const [selectedTab, setSelectedTab] = useState(0)
  const flips: [FlipCellProps[], FlipCellProps[]] = [
    openFlips,
    goodPlacesToStartFlips,
  ]

  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <HeaderWithLink className="text-h2" headerLink={headerLink}>
          FLIPs
        </HeaderWithLink>
        <ButtonLink rightIcon="right" href={githubUrl} variant="secondary">
          Go to GitHub
        </ButtonLink>
      </div>
      <p className="mt-4 mb-6 max-w-[480px] text-primary-gray-400 dark:text-primary-gray-100">
        Flow improvement proposals can be submitted through a PR and are
        intended to propose changes to Flow's network and standards
      </p>

      <div className="mb-6">
        <div className="py-6">
          {flips[selectedTab]!.length > 0 ? (
            <>
              <FlipCellHeader />
              <div className="flex flex-col gap-4">
                {(selectedTab === 0 ? openFlips : goodPlacesToStartFlips)
                  .sort((a, b) => (a.numComments > b.numComments ? -1 : 1))
                  .slice(0, 5)
                  .map((flip, index) => (
                    <div key={index}>
                      <FlipCell {...flip} />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p>There are currently no open FLIPs. Check back later!</p>
          )}
        </div>
      </div>
    </div>
  )
}
