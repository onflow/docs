import clsx from "clsx"
import ChevronRight from "../../../../images/arrows/chevron-right.svg"
import ExternalLinkIcon from "../../../../images/content/external-link.svg"
import { isLinkExternal } from "../../utils/isLinkExternal"
import AppLink from "../AppLink"
import Tag from "../Tag"
import { HeaderWithLink } from "../HeaderWithLink"

export type HomepageBrowseItemProps = {
  description: string
  icon?: React.ReactNode
  title: string
  links: Array<{
    href: string
    title: string
    tags?: string[]
  }>
}

export type HomepageBrowseProps = {
  items: HomepageBrowseItemProps[]
  topRounded?: boolean
}

export function HomepageBrowse({
  items,
  topRounded = true,
}: HomepageBrowseProps) {
  const classes = clsx(
    "grid grid-cols-1 pb-8 bg-white rounded-lg gap-x-4 dark:bg-primary-gray-dark md:grid-cols-3 md:flex-row md:px-10",
    {
      "rounded-tr-none rounded-tl-none": !topRounded,
    }
  )

  return (
    <div className="container">
      <div className="mb-4">
        <HeaderWithLink className="text-h2 mb-2" headerLink={"browse-by topic"}>
          Browse By Topic
        </HeaderWithLink>
        <p>
          Core concepts and tools you will need to get started building on Flow
        </p>
      </div>
      <div className={classes}>
        {items.map((item, index) => (
          <div
            key={`${item.title}-header`}
            className={clsx("px-8 pt-12 md:row-start-1", {
              "row-start-1": index === 0,
              "row-start-3": index === 1,
              "row-start-5": index === 2,
              "grid-column-start-1": index === 0,
              "grid-column-start-2": index === 1,
              "grid-column-start-3": index === 2,
            })}
          >
            <h6 className="text-h6 mb-1 flex items-center">
              {item.icon && (
                <span className="mr-2 max-w-[36px] text-primary-gray-300 dark:text-primary-gray-50">
                  {item.icon}
                </span>
              )}
              {item.title}
            </h6>
          </div>
        ))}
        {items.map((item, index) => (
          <div
            key={`${item.title}-content`}
            className={clsx(
              "divide-y divide-primary-gray-100 px-4 dark:divide-primary-gray-400 md:row-start-2 md:pb-4",
              {
                "row-start-2": index === 0,
                "row-start-4": index === 1,
                "row-start-6": index === 2,
              }
            )}
          >
            {item.links?.map((link) => (
              <div key={link.title} className="divided-item-hover">
                <AppLink
                  className=" link-card-3-column-link group flex flex-col rounded-lg px-4 text-sm hover:bg-primary-gray-50 dark:hover:bg-primary-gray-400"
                  to={link.href}
                >
                  <span className="display-block py-4">
                    <div className="flex justify-between">
                      {link.title}
                      <div>
                        {isLinkExternal(link.href) ? (
                          // "artificial" centering due to viewbox adding padding
                          <div className="pr-[3px] pt-[2px]">
                            <ExternalLinkIcon />
                          </div>
                        ) : (
                          <ChevronRight />
                        )}
                      </div>
                    </div>
                    <div>
                      {link.tags?.map((tag) => (
                        <Tag key={tag} name={tag} />
                      ))}
                    </div>
                  </span>
                </AppLink>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
