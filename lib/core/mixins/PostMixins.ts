import type { AppBskyFeedPost } from "@atproto/api"

import type { Resolvable } from "../utils/resolvable"
import { Step, StepPostLike, StepPostReply, StepPostRepost } from "../../trotsky"

export type PostReplyParams = Partial<AppBskyFeedPost.Record> & { "text": string }
export type ResolvablePostReplyParams = Resolvable<PostReplyParams>

export abstract class PostMixins<P, C, O> extends Step<P, C, O> {
  reply (record: ResolvablePostReplyParams) {
    return this.append(StepPostReply<this>, record)
  }

  like () {
    return this.append(StepPostLike<this>)
  }

  repost () {
    return this.append(StepPostRepost<this>)
  }
}