import type { AppBskyFeedPost } from "@atproto/api"

import type { Resolvable } from "../utils/resolvable"
import { Step, StepPostAuthor, StepPostLike, StepPostLikers, StepPostQuotes, StepPostReply, StepPostRepost, StepPostReposters, StepPostThread, StepPostUnlike, type StepPostThreadQueryParams } from "../../trotsky"

/**
 * Type representing the parameters for a post reply, including text and optional additional metadata.
 * @public
 */
export type PostReplyParams = Partial<AppBskyFeedPost.Record> & { "text": string }

/**
 * Type representing a value that can be resolved into {@link PostReplyParams}.
 * @public
 */
export type ResolvablePostReplyParams = Resolvable<PostReplyParams>

/**
 * A mixin class providing reusable post-related methods to extend step functionality.
 * These methods append specific post-related steps to the current chain.
 * 
 * @typeParam P - The parent type of this step.
 * @typeParam C - The context type.
 * @typeParam O - The output type.
 * @public
 */
export abstract class PostMixins<P, C, O> extends Step<P, C, O> {

  /**
   * Appends a step to reply to the current post.
   * 
   * @param record - The parameters for the reply, which may be resolved at runtime.
   * @returns The appended {@link StepPostReply} instance.
   */
  reply (record: ResolvablePostReplyParams): StepPostReply<this> {
    return this.append(StepPostReply<this>, record)
  }

  /**
   * Appends a step to like the current post.
   * 
   * @returns The appended {@link StepPostLike} instance.
   */
  like (): StepPostLike<this> {
    return this.append(StepPostLike<this>)
  }

  /**
   * Appends a step to unlike the current post.
   *
   * @returns The appended {@link StepPostUnlike} instance.
   */
  unlike (): StepPostUnlike<this> {
    return this.append(StepPostUnlike<this>)
  }

  /**
   * Appends a step to repost the current post.
   * 
   * @returns The appended {@link StepPostRepost} instance.
   */
  repost (): StepPostRepost<this> {
    return this.append(StepPostRepost<this>)
  }

  /**
   * Appends a step to retrieve the author of the current post.
   *
   * @returns The appended {@link StepPostAuthor} instance.
   */
  author (): StepPostAuthor<this> {
    return this.append(StepPostAuthor<this>)
  }

  /**
   * Appends a step to retrieve the actors who liked the current post.
   *
   * @returns The appended {@link StepPostLikers} instance.
   */
  likers (): StepPostLikers<this> {
    return this.append(StepPostLikers<this>)
  }

  /**
   * Appends a step to retrieve the actors who reposted the current post.
   *
   * @returns The appended {@link StepPostReposters} instance.
   */
  reposters (): StepPostReposters<this> {
    return this.append(StepPostReposters<this>)
  }

  /**
   * Appends a step to retrieve the quote posts of the current post.
   *
   * @returns The appended {@link StepPostQuotes} instance.
   */
  quotes (): StepPostQuotes<this> {
    return this.append(StepPostQuotes<this>)
  }

  /**
   * Appends a step to retrieve the full thread of the current post.
   *
   * @param options - Optional parameters for thread depth and parent height.
   * @returns The appended {@link StepPostThread} instance.
   */
  thread (options?: Partial<StepPostThreadQueryParams>): StepPostThread<this> {
    return this.append(StepPostThread<this>, options)
  }
}
