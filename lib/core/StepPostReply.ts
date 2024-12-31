import type { AppBskyFeedPost } from '@atproto/api'

import { Step } from "../trotsky"

export class StepPostReply extends Step {
  protected _record: AppBskyFeedPost.Record

  constructor(agent, parent, record) {
    super(agent, parent)
    this._record = record
  }

  async apply() {
    console.log('Reply to post')
  }
}
