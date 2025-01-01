import type { Did, AppBskyActorGetProfile } from "@atproto/api"

import type { Resolvable } from './utils/resolvable'
import { ActorMixins } from "./mixins/ActorMixins"
import { resolveValue } from './utils/resolvable'

export type StepActorParam = Did | string

export class StepActor extends ActorMixins {
  _param: Resolvable<StepActorParam>
  _context: AppBskyActorGetProfile.OutputSchema | null = null

  constructor(agent, parent, param: Resolvable<StepActorParam>) {
    super(agent, parent)
    this._param = param
  }

  async apply() {
    const actor = await resolveValue<StepActorParam>(this, this._param)
    const { data } = await this.agent.getProfile({ actor })
    this._context = data
  }
}
