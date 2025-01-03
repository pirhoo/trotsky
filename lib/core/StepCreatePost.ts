import type { AtpAgent, AppBskyFeedPost } from "@atproto/api"

import { Step, type ParentConstraint } from "../trotsky"
import { resolveValue, type Resolvable } from "./utils/resolvable"

export type StepCreatePostParams = Partial<AppBskyFeedPost.Record> & Omit<AppBskyFeedPost.Record, "createdAt">
export type StepCreatePostOutput = { "uri": string; "cid": string }

export type ResolvableStepCreatePostParams = Resolvable<StepCreatePostParams>

export class StepCreatePost<P = ParentConstraint, C = null, O extends StepCreatePostOutput = StepCreatePostOutput> extends Step<P, C, O> {
  _record: ResolvableStepCreatePostParams

  constructor (agent: AtpAgent, parent: P, record: ResolvableStepCreatePostParams) {
    super(agent, parent)
    this._record = record
  }

  async apply () {
    this.output = await this.agent.post(await this.queryParams()) as O
  }

  async queryParams (): Promise<StepCreatePostParams> {
    return resolveValue<StepCreatePostParams>(this, this._record)
  }
}