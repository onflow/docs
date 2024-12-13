import { Metric } from "web-vitals"

declare global {
  interface Window {
    gtag: (
      option: string,
      gaTrackingId: string,
      options: Record<string, unknown>
    ) => void
  }
}

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
export const pageview = (url: string, trackingId: string) => {
  if (process.env.NODE_ENV !== "production") return

  if (!window.gtag) {
    console.warn(
      "window.gtag is not defined. This could mean your google anylatics script has not loaded on the page yet."
    )
    return
  }
  window.gtag("config", trackingId, {
    page_path: url,
  })
}

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */
export const event = ({
  action = "unknown",
  category,
  label,
  value,
}: {
  action?: string;
  category?: string;
  label?: string;
  value?: number | string;
}) => {
  if (process.env.NODE_ENV !== "production") return

  if (!window.gtag) {
    console.warn(
      "window.gtag is not defined. This could mean your google anylatics script has not loaded on the page yet."
    )
    return
  }
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

export const reportWebVitalsToGA = (vitals: Metric) => {
  if (process.env.NODE_ENV === "production") {
    window.gtag("event", vitals.name, {
      ...vitals,
      value: vitals.delta, // Use `delta` so the value can be summed
      metric_id: vitals.id, // Needed to aggregate events.
      metric_value: vitals.value, // Raw value from the report.
    })
  }

  if (window.ENV.LOG_WEB_VITALS) {
    console.log(vitals)
  }
}
