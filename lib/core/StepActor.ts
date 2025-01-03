import type { AtpAgent, AppBskyActorGetProfile } from "@atproto/api"

import type { Resolvable } from "./utils/resolvable"
import type { ParentConstraint, Step } from "../trotsky"
import { ActorMixins } from "./mixins/ActorMixins"
import { resolveValue } from "./utils/resolvable"

export type StepActorParam = string
export type StepActorOutput = AppBskyActorGetProfile.OutputSchema

export class StepActor<P = ParentConstraint, C = null, O extends StepActorOutput = StepActorOutput> extends ActorMixins<P, C, O> {
  _param: Resolvable<StepActorParam>

  constructor (agent: AtpAgent, parent: P, param: Resolvable<StepActorParam>) {
    super(agent, parent)
    this._param = param
  }

  async apply () {
    const actor = await resolveValue<StepActorParam>(this as Step<ParentConstraint>, this._param)
    const { data } = await this.agent.getProfile({ actor })
    this.output = data as O
  }
}
