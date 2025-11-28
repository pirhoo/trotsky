/**
 * Type definitions for post-related operations.
 * @module types/post
 */

import type { AppBskyFeedDefs, AppBskyFeedPost, AtUri } from "@atproto/api"

/**
 * Parameter type for identifying a single post by its URI.
 *
 * @example
 * ```ts
 * const post1: PostUri = "at://did:plc:example/app.bsky.feed.post/postid"
 * const post2: PostUri = new AtUri("at://...")
 * ```
 *
 * @public
 */
export type PostUri = string | AtUri

/**
 * Parameter type for identifying multiple posts by their URIs.
 *
 * @public
 */
export type PostsUris = PostUri[]

/**
 * Output type for a single post view.
 *
 * @public
 */
export type PostOutput = AppBskyFeedDefs.PostView

/**
 * Output type for multiple post views.
 *
 * @public
 */
export type PostsOutput = AppBskyFeedDefs.PostView[]

/**
 * Type for post record data.
 *
 * @public
 */
export type PostRecord = AppBskyFeedPost.Record

/**
 * Parameters for creating a new post.
 *
 * @public
 */
export interface CreatePostParams {

  /** The text content of the post */
  "text": string;

  /** Optional facets for rich text (links, mentions, etc.) */
  "facets"?: AppBskyFeedPost.Record["facets"];

  /** Optional reply reference */
  "reply"?: AppBskyFeedPost.Record["reply"];

  /** Optional embed (images, external links, etc.) */
  "embed"?: AppBskyFeedPost.Record["embed"];

  /** Optional language tags */
  "langs"?: string[];

  /** Optional labels */
  "labels"?: AppBskyFeedPost.Record["labels"];

  /** Optional tags */
  "tags"?: string[];

  /** Creation timestamp (defaults to now) */
  "createdAt"?: string;
}

/**
 * Parameters for replying to a post.
 *
 * @public
 */
export interface ReplyParams {

  /** The text content of the reply */
  "text": string;

  /** Optional facets for rich text */
  "facets"?: AppBskyFeedPost.Record["facets"];

  /** Optional embed */
  "embed"?: AppBskyFeedPost.Record["embed"];

  /** Optional language tags */
  "langs"?: string[];
}
