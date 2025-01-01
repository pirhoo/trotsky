import type { Did, AppBskyActorGetProfile } from "@atproto/api"

import type { Resolvable } from './utils/resolvable'
import { ActorMixins } from "./mixins/ActorMixins"
import { resolveValue } from './utils/resolvable'

type Actor = Did | string

export class StepActor extends ActorMixins {
  _actor: Resolvable<Actor>
  _context: AppBskyActorGetProfile.OutputSchema | null = null

  constructor(agent, parent, actor: Resolvable<Actor>) {
    super(agent, parent)
    this._actor = actor
  }

  async apply() {
    const actor = await resolveValue<Actor>(this, this._actor)
    const { data } = await this.agent.getProfile({ actor })
    this._context = data
  }
}
