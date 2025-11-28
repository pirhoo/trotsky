/**
 * Central export point for Trotsky configuration.
 *
 * @module config
 * @packageDocumentation
 */

export type {
  LoggingConfig,
  PaginationConfig,
  RetryConfig,
  RateLimitConfig,
  CacheConfig,
  TrotskyConfig,
  PartialTrotskyConfig
} from "./TrotskyConfig"

export {
  defaultConfig,
  mergeConfig
} from "./TrotskyConfig"
