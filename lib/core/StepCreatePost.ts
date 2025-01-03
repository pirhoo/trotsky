import type {  AtpAgent } from "@atproto/api"

import { Step, type ParentConstraint } from "../trotsky"
import { PostParams, ResolvablePostParams } from "./mixins/PostMixins"
import { resolveValue } from "./utils/resolvable"

interface RecordRef {
  "uri": string; 
  "cid": string; 
}

export type StepCreatePostParams = PostParams
export type StepCreatePostOutput = RecordRef

export class StepCreatePost<P = ParentConstraint, C = null, O extends StepCreatePostOutput = StepCreatePostOutput> extends Step<P, C, O> {
  _record: ResolvablePostParams

  constructor (agent: AtpAgent, parent: P, record: ResolvablePostParams) {
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