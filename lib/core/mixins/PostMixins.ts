import type { AppBskyFeedPost } from "@atproto/api"

import type { Resolvable } from "../utils/resolvable"
import { Step, StepPostAuthor, StepPostLike, StepPostReply, StepPostRepost } from "../../trotsky"

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
}
