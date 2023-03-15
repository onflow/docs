import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  type Side,
  useFloating,
} from '@floating-ui/react-dom'
import {} from '@headlessui/react'
import clsx from 'clsx'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ExternalLinkIcon from '../../../../images/content/external-link.svg'
import DropdownArrowIcon from '../../../../images/misc/dropdown-arrow.svg'
import GithubIcon from '../../../../images/social/github.svg'
import AppLink from '../AppLink'

export interface GithubLink {
  href: string
  title: string
}

export interface GithubLinksProps {
  links: [GithubLink, ...GithubLink[]]
}

const ARROW_HEIGHT = 15
const ARROW_WIDTH = 20

/**
 * Renders a Github Icon that takes the user to the first link specified
 * by the `links` prop. If there are additional links they will be shown in
 * a popup menu that is shown when the user hovers the primary link.
 */
export const GithubLinks = ({ links }: GithubLinksProps) => {
  const [isHovering, setIsHovering] = useState(false)
  const arrowRef = useRef(null)
  const { x, y, strategy, reference, floating, placement, middlewareData } =
    useFloating({
      middleware: [
        offset(ARROW_HEIGHT),
        flip(),
        shift({ padding: 5 }),
        arrow({ element: arrowRef }),
      ],
      placement: 'bottom-start',
      whileElementsMounted: autoUpdate,
    })

  const { arrow: arrowData, flip: flipData } = middlewareData

  const onMouseLeaveHandler = useMemo(
    () =>
      debounce(() => {
        setIsHovering(false)
      }, 200),
    []
  )

  const onMouseEnterHandler = useCallback(() => {
    onMouseLeaveHandler.cancel()
    setIsHovering(true)
  }, [onMouseLeaveHandler])

  useEffect(() => {
    return () => {
      onMouseLeaveHandler.cancel()
    }
  }, [onMouseLeaveHandler])

  const placementSide = placement.split('-')[0]! as Side
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placementSide]! as Side

  return (
    <>
      <AppLink
        ref={reference}
        to={links[0].href}
        className="origin-left scale-150 hover:opacity-75"
        title={links[0].href}
        onMouseEnter={() => { onMouseEnterHandler() }}
        onMouseLeave={() => onMouseLeaveHandler()}
      >
        <GithubIcon />
      </AppLink>
      <div
        ref={floating}
        className={clsx('z-40', { hidden: !isHovering || links.length < 2 })}
        style={{
          top: y ?? 0,
          left: x ?? 0,
          position: strategy,
        }}
        onMouseEnter={() => { onMouseEnterHandler() }}
        onMouseLeave={() => onMouseLeaveHandler()}
      >
        <div
          ref={arrowRef}
          style={{
            top: arrowData?.y,
            [flipData?.index === 1 ? 'left' : 'right']: arrowData?.x
              ? arrowData.x + ARROW_WIDTH / 2
              : undefined,
            [staticSide]: -1 * ARROW_HEIGHT,
            height: ARROW_HEIGHT,
          }}
          className="absolute scale-50 text-white dark:text-primary-gray-dark"
        >
          <DropdownArrowIcon />
        </div>
        <div
          className="flex flex-col divide-y divide-solid divide-primary-gray-100 rounded-lg bg-white shadow-2xl dark:divide-primary-gray-400 dark:bg-primary-gray-dark dark:hover:shadow-2xl-dark "
          style={{
            marginTop: arrowData?.y ?? 0,
          }}
        >
          {links.map(({ href, title }, index) => (
            <AppLink
              key={index}
              className="flex justify-between whitespace-nowrap p-2 "
              to={href}
              title={title}
            >
              <span>{title}</span>
              <ExternalLinkIcon />
            </AppLink>
          ))}
        </div>
      </div>
    </>
  )
}
