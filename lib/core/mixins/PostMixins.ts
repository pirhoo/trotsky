import type { AppBskyFeedPost } from '@atproto/api'

import { Step, StepPostReply } from "../../trotsky"

export class PostMixins extends Step {
  reply(record: Partial<AppBskyFeedPost.Record>) {
    return this.append(StepPostReply, record)
  }
}