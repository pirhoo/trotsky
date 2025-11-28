/**
 * Configuration options for Trotsky instance.
 *
 * This module provides configuration interfaces and default values
 * for customizing Trotsky's behavior.
 *
 * @module config
 */

/**
 * Logging configuration options.
 *
 * @public
 */
export interface LoggingConfig {
  /** Enable or disable logging */
  enabled: boolean
  /** Minimum log level to output */
  level: "debug" | "info" | "warn" | "error"
  /** Custom logger function (optional) */
  logger?: (level: string, message: string, meta?: Record<string, unknown>) => void
}

/**
 * Pagination configuration options.
 *
 * @public
 */
export interface PaginationConfig {
  /** Default page size for paginated requests */
  defaultLimit: number
  /** Maximum page size allowed */
  maxLimit: number
  /** Enable automatic pagination */
  autoPaginate: boolean
}

/**
 * Retry configuration options.
 *
 * @public
 */
export interface RetryConfig {
  /** Enable automatic retries on failure */
  enabled: boolean
  /** Maximum number of retry attempts */
  maxAttempts: number
  /** Backoff strategy for retries */
  backoff: "linear" | "exponential"
  /** Initial delay between retries (milliseconds) */
  initialDelay: number
  /** Maximum delay between retries (milliseconds) */
  maxDelay: number
  /** HTTP status codes that should trigger a retry */
  retryableStatusCodes: number[]
}

/**
 * Rate limiting configuration options.
 *
 * @public
 */
export interface RateLimitConfig {
  /** Enable built-in rate limiting */
  enabled: boolean
  /** Maximum requests per minute */
  requestsPerMinute: number
  /** Maximum concurrent requests */
  concurrentRequests: number
  /** Behavior when rate limit is hit */
  onLimitReached: "throw" | "queue" | "drop"
}

/**
 * Caching configuration options.
 *
 * @public
 */
export interface CacheConfig {
  /** Enable caching */
  enabled: boolean
  /** Default cache TTL in milliseconds */
  defaultTTL: number
  /** Maximum cache size (number of entries) */
  maxSize: number
  /** Cache key prefix */
  keyPrefix: string
}

/**
 * Complete Trotsky configuration.
 *
 * @public
 */
export interface TrotskyConfig {
  /** Logging configuration */
  logging: LoggingConfig
  /** Pagination configuration */
  pagination: PaginationConfig
  /** Retry configuration */
  retry: RetryConfig
  /** Rate limiting configuration */
  rateLimit: RateLimitConfig
  /** Caching configuration */
  cache: CacheConfig
}

/**
 * Partial configuration allowing users to override specific options.
 *
 * @public
 */
export type PartialTrotskyConfig = {
  [K in keyof TrotskyConfig]?: Partial<TrotskyConfig[K]>
}

/**
 * Default configuration values.
 *
 * These values are used when no custom configuration is provided.
 *
 * @public
 */
export const defaultConfig: TrotskyConfig = {
  logging: {
    enabled: false,
    level: "info"
  },
  pagination: {
    defaultLimit: 50,
    maxLimit: 100,
    autoPaginate: true
  },
  retry: {
    enabled: true,
    maxAttempts: 3,
    backoff: "exponential",
    initialDelay: 1000,
    maxDelay: 30000,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504]
  },
  rateLimit: {
    enabled: false,
    requestsPerMinute: 60,
    concurrentRequests: 10,
    onLimitReached: "queue"
  },
  cache: {
    enabled: false,
    defaultTTL: 60000, // 1 minute
    maxSize: 1000,
    keyPrefix: "trotsky:"
  }
}

/**
 * Merges partial configuration with default configuration.
 *
 * @param config - Partial configuration to merge
 * @returns Complete configuration with defaults
 *
 * @example
 * ```ts
 * const config = mergeConfig({
 *   logging: { enabled: true, level: "debug" }
 * })
 * ```
 *
 * @public
 */
export function mergeConfig (config?: PartialTrotskyConfig): TrotskyConfig {
  if (!config) {
    return { ...defaultConfig }
  }

  return {
    logging: { ...defaultConfig.logging, ...config.logging },
    pagination: { ...defaultConfig.pagination, ...config.pagination },
    retry: { ...defaultConfig.retry, ...config.retry },
    rateLimit: { ...defaultConfig.rateLimit, ...config.rateLimit },
    cache: { ...defaultConfig.cache, ...config.cache }
  }
}
