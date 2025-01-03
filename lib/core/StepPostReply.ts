import type { AppBskyFeedPost, AtpAgent } from "@atproto/api"
import type { ResolvablePostReplyParams, PostReplyParams } from "./mixins/PostMixins"
import { resolveValue } from "./utils/resolvable"

import { Step, type StepPost, type StepPostOutput } from "../trotsky"

export interface StepPostReplyRecordRef {
  "uri": string; "cid": string;  
}

export interface StepPostReplyRef {
  "parent": StepPostReplyRecordRef; "root": StepPostReplyRecordRef;  
}

export type StepPostReplyOutput = StepPostReplyRecordRef


export class StepPostReply<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostReplyOutput = StepPostReplyOutput> extends Step<P, C, O> {
  _record: ResolvablePostReplyParams

  constructor (agent: AtpAgent, parent: P, record: ResolvablePostReplyParams) {
    super(agent, parent)
    this._record = record
  }

  async apply () {
    this.output = await this.agent.post(await this.queryParams()) as O
  }

  async queryParams (): Promise<AppBskyFeedPost.Record> {
    const params = await resolveValue<PostReplyParams>(this, this._record)
    const createdAt = new Date().toISOString()
    const reply = this.replyParams()
    return {
      createdAt,
      reply,
      ...params
    }
  }

  replyParams (): AppBskyFeedPost.Record["reply"] {
    const post = this.context as C & { "record"?: { "reply"?: StepPostReplyRef } }
    const reply = post?.record?.reply ?? null
    const parent = { "uri": post.uri, "cid": post.cid }
    const root = reply ? { "uri": reply.root.uri, "cid": reply.root.cid } : parent
    return { root, parent }
  }
}
