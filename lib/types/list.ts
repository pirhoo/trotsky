/**
 * Type definitions for list-related operations.
 * @module types/list
 */

import type { AppBskyGraphDefs, AtUri } from "@atproto/api"

/**
 * Parameter type for identifying a single list by its URI.
 *
 * @example
 * ```ts
 * const list: ListUri = "at://did:plc:example/app.bsky.graph.list/listid"
 * ```
 *
 * @public
 */
export type ListUri = string | AtUri

/**
 * Parameter type for identifying multiple lists by their URIs.
 *
 * @public
 */
export type ListsUris = ListUri[]

/**
 * Output type for a single list view.
 *
 * @public
 */
export type ListOutput = AppBskyGraphDefs.ListView

/**
 * Output type for multiple list views.
 *
 * @public
 */
export type ListsOutput = AppBskyGraphDefs.ListView[]

/**
 * Output type for list item views (members of a list).
 *
 * @public
 */
export type ListItemView = AppBskyGraphDefs.ListItemView

/**
 * Purpose/type of a list.
 *
 * @public
 */
export type ListPurpose =
  | "app.bsky.graph.defs#modlist"
  | "app.bsky.graph.defs#curatelist"
  | "app.bsky.graph.defs#referencelist"
  | (string & {})
