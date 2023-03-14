export type LogFunction = typeof console.log

const LOG_LEVELS = ["trace", "debug", "info", "warn", "error"] as const

export type LogLevel = typeof LOG_LEVELS[number]

export interface Logger extends Record<LogLevel, LogFunction> {
  level: LogLevel
}

declare global {
  var loggerInstance: Logger | undefined
}

const LOG_LEVEL_DEFAULT: LogLevel =
  process.env.NODE_ENV == "production" ? "info" : ("debug" as LogLevel)

const noop: LogFunction = () => {}

// TODO: Replace with a proper logging solution, i.e. https://getpino.io

function getLogger() {
  const logLevelEnv = process.env.LOG_LEVEL as LogLevel
  const level = LOG_LEVELS.includes(logLevelEnv)
    ? logLevelEnv
    : (LOG_LEVEL_DEFAULT as LogLevel)

  const levelIndex = LOG_LEVELS.indexOf(level)

  console.log(`Creating logger with log level ${level} (${levelIndex})`)

  return LOG_LEVELS.reduce(
    (logger, level) => ({
      ...logger,
      [level]: LOG_LEVELS.indexOf(level) >= levelIndex ? console[level] : noop,
    }),
    {
      level,
    } as Logger
  )
}

// Remix purges the require cache on every request in development, so in order
// to prevent the logger from being recreated on every request we attach it to
// `global`.
// See: https://github.com/remix-run/remix/discussions/3690
// and: https://github.com/remix-run/remix/discussions/3515
const logger: Logger =
  process.env.NODE_ENV === "development"
    ? global.loggerInstance ?? (global.loggerInstance = getLogger())
    : getLogger()

export default logger
