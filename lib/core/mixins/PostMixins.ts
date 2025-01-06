import type { AppBskyFeedPost } from "@atproto/api"

import type { Resolvable } from "../utils/resolvable"
import { Step, StepPostAuthor, StepPostLike, StepPostReply, StepPostRepost } from "../../trotsky"

export type PostReplyParams = Partial<AppBskyFeedPost.Record> & { "text": string }
export type ResolvablePostReplyParams = Resolvable<PostReplyParams>

export abstract class PostMixins<P, C, O> extends Step<P, C, O> {
  reply (record: ResolvablePostReplyParams): StepPostReply<this> {
    return this.append(StepPostReply<this>, record)
  }

  like (): StepPostLike<this> {
    return this.append(StepPostLike<this>)
  }

  repost (): StepPostRepost<this> {
    return this.append(StepPostRepost<this>)
  }

  author (): StepPostAuthor<this> {
    return this.append(StepPostAuthor<this>)
  }
}