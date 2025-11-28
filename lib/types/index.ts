/**
 * Central export point for all shared type definitions.
 *
 * This module provides type definitions used throughout Trotsky,
 * offering a single source of truth for common types across the library.
 *
 * @module types
 * @packageDocumentation
 */

// Actor types
export type {
  ActorParam,
  ActorsParam,
  ActorOutput,
  ActorsOutput,
  ActorProfileView,
  ActorProfileViewDetailed
} from "./actor"

// Post types
export type {
  PostUri,
  PostsUris,
  PostOutput,
  PostsOutput,
  PostRecord,
  CreatePostParams,
  ReplyParams
} from "./post"

// List types
export type {
  ListUri,
  ListsUris,
  ListOutput,
  ListsOutput,
  ListItemView,
  ListPurpose
} from "./list"

// Pagination types
export type {
  PaginationParams,
  PaginatedResponse,
  PaginatedQueryParams
} from "./pagination"
