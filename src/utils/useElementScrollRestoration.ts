import { useEffect, useRef } from "react"
import { useLocation, useTransition } from "@remix-run/react"
import { useIsomorphicLayoutEffect } from "../ui/design-system/src/lib/utils/useIsomorphicLayoutEffect"

/**
 * Handles scroll restoration and reseting for a scrolling container element
 *
 * Code taken from: {@link https://github.com/remix-run/remix/issues/186#issuecomment-895583783}
 *
 * @param ref The scrolling element
 * @param enabled True if scroll restoration is enabled, otherwise false.
 */
export function useElementScrollRestoration(
  ref: React.MutableRefObject<HTMLElement | null>,
  enabled: boolean = true
) {
  const positions = useRef<Map<string, number>>(new Map()).current
  const location = useLocation()
  const previousLocation = useRef<ReturnType<typeof useLocation>>()
  const transition = useTransition()

  useEffect(() => {
    previousLocation.current = location
  }, [location])

  useEffect(() => {
    if (!ref.current) return
    if (transition.state === "loading") {
      positions.set(location.key, ref.current.scrollTop)
    }
  }, [transition.state, location.key, ref, positions])

  useIsomorphicLayoutEffect(() => {
    if (!enabled) return
    if (transition.state !== "idle") return
    if (!ref.current) return

    // Don't reset/restore scroll if the pathname and search match (likely
    // meaning just the hash was changed).
    if (
      previousLocation.current?.pathname === location.pathname &&
      previousLocation.current.search === location.search
    )
      return

    const y = positions.get(location.key)
    ref.current.scrollTo(0, y ?? 0)
  }, [transition.state, location.key, positions, ref])
}
