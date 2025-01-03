import type { AppBskyFeedPost, AtpAgent } from "@atproto/api"
import type { ResolvableReplyParams, ReplyParams } from "./mixins/PostMixins"
import { resolveValue } from "./utils/resolvable"

import {
  Step, 
  type StepPost, 
  type StepPostOutput 
} from "../trotsky"

interface ReplyRecordRef {
  "uri": string;
  "cid": string; 
}
interface ReplyRefs {
  "parent": ReplyRecordRef;
  "root": ReplyRecordRef; 
}

export type StepPostReplyOutput = ReplyRecordRef

export class StepPostReply<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostReplyOutput = StepPostReplyOutput> extends Step<P, C, O> {
  _record: ResolvableReplyParams

  constructor (agent: AtpAgent, parent: P, record: ResolvableReplyParams) {
    super(agent, parent)
    this._record = record
  }

  async apply () {
    this.output = await this.agent.post(await this.queryParams()) as O
  }

  async queryParams (): Promise<AppBskyFeedPost.Record> {
    const params = await resolveValue<ReplyParams>(this, this._record)
    const createdAt = new Date().toISOString()
    const reply = this.replyParams()
    return {
      createdAt,
      reply,
      ...params
    }
  }

  replyParams (): AppBskyFeedPost.Record["reply"] {
    const post = this.context as C & { "record"?: { "reply"?: ReplyRefs } }
    const reply = post?.record?.reply ?? null
    const parent = { "uri": post.uri, "cid": post.cid }
    const root = reply ? { "uri": reply.root.uri, "cid": reply.root.cid } : parent
    return { root, parent }
  }
}
