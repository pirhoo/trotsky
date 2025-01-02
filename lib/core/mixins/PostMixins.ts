import type { AppBskyFeedPost } from '@atproto/api'

import type { Resolvable } from '../utils/resolvable'
import { Step, StepPostReply } from "../../trotsky"

export type ReplyParams = Partial<AppBskyFeedPost.Record> & { text: string }
export type ResolvableReplyParams = Resolvable<ReplyParams>

export class PostMixins extends Step {
  reply(record: ResolvableReplyParams) {
    return this.append(StepPostReply, record)
  }

  async apply() {
    throw new Error('`apply` method not implemented.')
  }
}