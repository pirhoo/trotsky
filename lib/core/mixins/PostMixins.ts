import type { AppBskyFeedPost } from "@atproto/api"

import type { Resolvable } from "../utils/resolvable"
import { Step, StepPostReply } from "../../trotsky"

export type ReplyParams = Partial<AppBskyFeedPost.Record> & { "text": string }
export type ResolvableReplyParams = Resolvable<ReplyParams>

export abstract class PostMixins<P, C, O> extends Step<P, C, O> {
  reply (record: ResolvableReplyParams) {
    return this.append(StepPostReply<this>, record)
  }
}