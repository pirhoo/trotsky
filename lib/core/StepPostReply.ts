import type { AppBskyFeedPost, AppBskyFeedDefs } from '@atproto/api'
import type { ResolvableReplyParams, ReplyParams } from './mixins/PostMixins'
import { resolveValue } from './utils/resolvable'

import { Step } from "../trotsky"

interface ReplyRecordRef { uri: string, cid: string }
interface ReplyRefs { parent: ReplyRecordRef, root: ReplyRecordRef }

export class StepPostReply extends Step {
  protected _record: ResolvableReplyParams

  constructor(agent, parent, record: ResolvableReplyParams) {
    super(agent, parent)
    this._record = record
  }

  async apply() {
    const params = await resolveValue<ReplyParams>(this, this._record)
    const reply = this.replyParams()
    await this.agent.post({ ...params, reply })
  }

  replyParams(): AppBskyFeedPost.Record['reply'] {
    const post = this.context as AppBskyFeedDefs.PostView & { record: { reply?: ReplyRefs } }
    const reply = post.record.reply as ReplyRefs
    const parent = { uri: post.uri, cid: post.cid }
    const root = reply ? { uri: reply.root.uri, cid: reply.root.cid } : parent
    return { root, parent }
  }
}
