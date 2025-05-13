export function getEnv() {
  return {
    BOT_DISCORD_TOKEN: process.env.BOT_DISCORD_TOKEN,
    BOT_GITHUB_TOKEN: process.env.BOT_GITHUB_TOKEN,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    NODE_ENV: process.env.NODE_ENV,
    REDIS_CA: process.env.REDIS_CA,
    REDIS_URL: process.env.REDIS_URL,
    REFRESH_CACHE_SECRET: process.env.REFRESH_CACHE_SECRET,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENV: process.env.SENTRY_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
    STATUSPAGE_API_KEY: process.env.STATUSPAGE_API_KEY,
  }
}

export const ENABLE_PREVIEWS = process.env.ENABLE_PREVIEWS === "true"
export const ENABLE_CONTENT_CHECKER =
  process.env.ENABLE_CONTENT_CHECKER === "true"

export type ENV = ReturnType<typeof getEnv>

function getFallbackOrigin() {
  switch (process.env.NODE_ENV) {
    case "production": {
      return "https://developers.flow.com"
    }
    default: {
      return "https://localhost:3000"
    }
  }
}

export const ORIGIN = process.env.ORIGIN || getFallbackOrigin()

/**
 * these values are exposed on window, don't put secrets here
 */
export function getPublicEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
    /**
     * the url origin, e.g. https://developers.flow.com or http://localhost:3000
     */
    ORIGIN: process.env.ORIGIN || getFallbackOrigin(),
    LOG_WEB_VITALS: process.env.LOG_WEB_VITALS,
  }
}

export type PUBLIC_ENV = ReturnType<typeof getPublicEnv>

// App puts these on
declare global {
  // eslint-disable-next-line
  var ENV: PUBLIC_ENV
  interface Window {
    ENV: PUBLIC_ENV
  }
}
