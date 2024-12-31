import type { Did, AppBskyActorGetProfile } from "@atproto/api"

import { ActorMixins } from "./mixins/ActorMixins"

type Actor = Did | string

export class StepActor extends ActorMixins {
  _actor: Actor
  _context: AppBskyActorGetProfile.OutputSchema | null = null

  constructor(agent, parent, actor: Actor) {
    super(agent, parent)
    this._actor = actor
  }

  async apply() {
    const { data } = await this.agent.getProfile({ actor: this._actor })
    this._context = data
  }
}
